/**
 * @file seed_colleges.ts
 * @description Seeds ~25 popular Indian colleges into the database.
 *              Run with: npm run db:seed:colleges
 */

import { pool } from '../connection';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../../../.env') });

const colleges = [
  { name: 'Indian Institute of Technology Bombay', short_name: 'IIT Bombay', city: 'Mumbai', state: 'Maharashtra', domain: 'iitb.ac.in' },
  { name: 'Indian Institute of Technology Delhi', short_name: 'IIT Delhi', city: 'New Delhi', state: 'Delhi', domain: 'iitd.ac.in' },
  { name: 'Indian Institute of Technology Madras', short_name: 'IIT Madras', city: 'Chennai', state: 'Tamil Nadu', domain: 'iitm.ac.in' },
  { name: 'Indian Institute of Technology Kharagpur', short_name: 'IIT KGP', city: 'Kharagpur', state: 'West Bengal', domain: 'iitkgp.ac.in' },
  { name: 'Indian Institute of Technology Kanpur', short_name: 'IIT Kanpur', city: 'Kanpur', state: 'Uttar Pradesh', domain: 'iitk.ac.in' },
  { name: 'Indian Institute of Technology Roorkee', short_name: 'IIT Roorkee', city: 'Roorkee', state: 'Uttarakhand', domain: 'iitr.ac.in' },
  { name: 'Indian Institute of Technology Hyderabad', short_name: 'IIT Hyderabad', city: 'Hyderabad', state: 'Telangana', domain: 'iith.ac.in' },
  { name: 'National Institute of Technology Trichy', short_name: 'NIT Trichy', city: 'Tiruchirappalli', state: 'Tamil Nadu', domain: 'nitt.edu' },
  { name: 'National Institute of Technology Surathkal', short_name: 'NITK Surathkal', city: 'Mangalore', state: 'Karnataka', domain: 'nitk.ac.in' },
  { name: 'Birla Institute of Technology and Science, Pilani', short_name: 'BITS Pilani', city: 'Pilani', state: 'Rajasthan', domain: 'bits-pilani.ac.in' },
  { name: 'Delhi Technological University', short_name: 'DTU', city: 'New Delhi', state: 'Delhi', domain: 'dtu.ac.in' },
  { name: 'Netaji Subhas University of Technology', short_name: 'NSUT', city: 'New Delhi', state: 'Delhi', domain: 'nsut.ac.in' },
  { name: 'Vellore Institute of Technology', short_name: 'VIT Vellore', city: 'Vellore', state: 'Tamil Nadu', domain: 'vit.ac.in' },
  { name: 'SRM Institute of Science and Technology', short_name: 'SRMIST', city: 'Chennai', state: 'Tamil Nadu', domain: 'srmist.edu.in' },
  { name: 'Manipal Institute of Technology', short_name: 'MIT Manipal', city: 'Manipal', state: 'Karnataka', domain: 'manipal.edu' },
  { name: 'PSG College of Technology', short_name: 'PSG Tech', city: 'Coimbatore', state: 'Tamil Nadu', domain: 'psgtech.ac.in' },
  { name: 'College of Engineering, Pune', short_name: 'COEP', city: 'Pune', state: 'Maharashtra', domain: 'coep.org.in' },
  { name: 'Jadavpur University', short_name: 'JU', city: 'Kolkata', state: 'West Bengal', domain: 'jadavpuruniversity.in' },
  { name: 'Anna University', short_name: 'Anna Univ', city: 'Chennai', state: 'Tamil Nadu', domain: 'annauniv.edu' },
  { name: 'Amrita Vishwa Vidyapeetham', short_name: 'Amrita', city: 'Coimbatore', state: 'Tamil Nadu', domain: 'amrita.edu' },
  { name: 'Thapar Institute of Engineering and Technology', short_name: 'Thapar', city: 'Patiala', state: 'Punjab', domain: 'thapar.edu' },
  { name: 'Indian Institute of Information Technology Allahabad', short_name: 'IIIT Allahabad', city: 'Prayagraj', state: 'Uttar Pradesh', domain: 'iiita.ac.in' },
  { name: 'Pune Institute of Computer Technology', short_name: 'PICT', city: 'Pune', state: 'Maharashtra', domain: 'pict.edu' },
  { name: 'Ramaiah Institute of Technology', short_name: 'MSRIT', city: 'Bengaluru', state: 'Karnataka', domain: 'msrit.edu' },
  { name: 'R.V. College of Engineering', short_name: 'RVCE', city: 'Bengaluru', state: 'Karnataka', domain: 'rvce.edu.in' },
];

async function seed() {
  console.log('🌱 Seeding colleges...');

  let inserted = 0;
  let skipped = 0;

  for (const c of colleges) {
    try {
      await pool.query(
        `INSERT INTO colleges (name, short_name, city, state, country, domain)
         VALUES ($1, $2, $3, $4, 'India', $5)
         ON CONFLICT (name) DO NOTHING`,
        [c.name, c.short_name, c.city, c.state, c.domain],
      );
      inserted++;
      console.log(`  ✓ ${c.short_name}`);
    } catch (err) {
      skipped++;
      console.warn(`  ⚠ Skipped ${c.name}:`, (err as Error).message);
    }
  }

  console.log(`\n✅ Seeding complete: ${inserted} inserted, ${skipped} skipped.`);
  await pool.end();
}

seed().catch((err) => {
  console.error('❌ Seed failed:', err);
  process.exit(1);
});
