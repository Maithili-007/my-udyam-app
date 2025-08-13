const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

router.post('/', async (req, res) => {
  const { step1, step2 } = req.body;
  if (
    !step1?.aadhaarNumber?.match(/^\d{12}$/) ||
    !step2?.panNumber?.match(/^[A-Za-z]{5}[0-9]{4}[A-Za-z]{1}$/)
  ) {
    return res.status(400).json({ error: 'Invalid form data' });
  }
  try {
    const record = await prisma.registration.create({
      data: {
        aadhaarNumber: step1.aadhaarNumber,
        entrepreneurName: step1.entrepreneurName,
        orgType: step2.orgType,
        panNumber: step2.panNumber,
        panHolderName: step2.panHolderName,
        dobOrDoi: new Date(step2.dobOrDoi),
      },
    });
    return res.json({ success: true, id: record.id });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Database error' });
  }
});

module.exports = router;
