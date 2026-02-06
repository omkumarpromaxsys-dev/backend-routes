import pool from "../config/db.js";

export const createListing = async (req, res) => {
  const profile = await pool.query(
    `
    SELECT status
    FROM provider_profiles
    WHERE user_id = $1
    `,
    [req.user.id]
  );

  if (profile.rows.length === 0) {
    return res.status(403).json({
      message: "Provider profile not found",
    });
  }

  if (profile.rows[0].status !== "approved") {
    return res.status(403).json({
      message: "Provider not approved yet",
    });
  }

  res.json({
    message: "Provider listing created...!",
    user: req.user,
  });
};


export const applyForProvider = async (req, res) => {
  const { organizationName, description, contactPhone } = req.body;

  if (!organizationName) {
    return res.status(400).json({
      message: "Organization name is required",
    });
  }

  const existing = await pool.query(
    "SELECT id FROM provider_profiles WHERE user_id = $1",
    [req.user.id]
  );

  if (existing.rows.length > 0) {
    return res.status(400).json({
      message: "Provider application already exists",
    });
  }

  await pool.query(
    `
    INSERT INTO provider_profiles
    (user_id, organization_name, description, contact_phone)
    VALUES ($1, $2, $3, $4)
    `,
    [req.user.id, organizationName, description, contactPhone]
  );

  res.status(201).json({
    message: "Provider application submitted and pending approval",
  });
};

export const getMyProviderStatus = async (req, res) => {
  const result = await pool.query(
    `
    SELECT
      organization_name,
      description,
      contact_phone,
      status,
      created_at,
      reviewed_at
    FROM provider_profiles
    WHERE user_id = $1
    `,
    [req.user.id]
  );

  if (result.rows.length === 0) {
    return res.status(404).json({
      message: "Provider application not found",
    });
  }

  res.json(result.rows[0]);
};

export const updateProviderProfile = async (req, res) => {
  const { organizationName, description, contactPhone } = req.body;

  const profile = await pool.query(
    `
    SELECT status
    FROM provider_profiles
    WHERE user_id = $1
    `,
    [req.user.id]
  );

  if (profile.rows.length === 0) {
    return res.status(404).json({
      message: "Provider profile not found",
    });
  }

  if (profile.rows[0].status !== "approved") {
    return res.status(403).json({
      message: "Profile can be edited only after approval",
    });
  }

  await pool.query(
    `
    UPDATE provider_profiles
    SET
      organization_name = COALESCE($1, organization_name),
      description = COALESCE($2, description),
      contact_phone = COALESCE($3, contact_phone)
    WHERE user_id = $4
    `,
    [organizationName, description, contactPhone, req.user.id]
  );

  res.json({
    message: "Provider profile updated successfully",
  });
};
