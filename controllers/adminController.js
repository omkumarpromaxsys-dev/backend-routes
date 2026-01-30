import pool from "../config/db.js";

export const listPendingProviders = async (req, res) => {
  const result = await pool.query(
    `
    SELECT pp.id, u.id AS user_id, u.email, pp.organization_name
    FROM provider_profiles pp
    JOIN users u ON u.id = pp.user_id
    WHERE pp.status = 'pending'
    `
  );

  res.json(result.rows);
};

export const approveProvider = async (req, res) => {
  const { userId } = req.params;

  await pool.query("BEGIN");

  try {
    await pool.query(
      `
      UPDATE provider_profiles
      SET status = 'approved', reviewed_at = NOW()
      WHERE user_id = $1
      `,
      [userId]
    );

    await pool.query(
      `
      UPDATE users
      SET role = 'provider'
      WHERE id = $1
      `,
      [userId]
    );

    await pool.query("COMMIT");

    res.json({ message: "Provider approved successfully" });
  } catch (err) {
    await pool.query("ROLLBACK");
    throw err;
  }
};

export const rejectProvider = async (req, res) => {
  const { userId } = req.params;

  await pool.query(
    `
    UPDATE provider_profiles
    SET status = 'rejected', reviewed_at = NOW()
    WHERE user_id = $1
    `,
    [userId]
  );

  res.json({ message: "Provider rejected" });
};
