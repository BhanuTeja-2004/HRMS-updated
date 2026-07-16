# Smart HRMS AI — RedFoxa Careerlink

Complete Next.js HRMS with **Admin Portal** and **Candidate Portal**.

## Quick Start

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

```bash
npm run build
npm start
```

## Demo Credentials

| Portal    | Email                 | Password      |
|-----------|-----------------------|---------------|
| Admin     | admin@redfoxa.com     | admin123      |
| Candidate | gayatri@redfoxa.com   | candidate123  |
| Candidate | candidate@redfoxa.com | candidate123  |

Signup works too — whatever name/email you register becomes the dynamic header & portal identity (not hardcoded to Gayatri).

## What’s included (updated)

### Auth
- Landing page portal selector
- Back button on Admin/Candidate login & signup → returns to `/`
- RedFoxa logo + site identity branding

### Candidate
- Dynamic logged-in user name/email everywhere
- Dashboard, Attendance (20+ history rows + live timer), Leaves (requests + holiday calendar matching reference), Payroll, Messages (notification badge), CRM, Job Openings

### CRM Recruitment Tracker
- **1000+ candidates** (paginated, stored in localStorage)
- Columns: Name, Phone, Email, Languages, Location, Process, Shortlisted, Interview, DOJ, Status, Remarks, **CTC**, **Take-home**, **Invoice**, **Clause**, Calls, **Timer**, Actions
- Actions: View / Edit / Clear(Delete) + Add / Clear quick-row
- Timer starts when a candidate is added and is persisted

### Admin
- Vendors: company, contact, website, agreement date, **job openings per company**, **document upload**
- Job openings: CTC, take-home, invoice date, clause date
- Selected candidates: full profile, interview date, joining date, company & role details
- Employees, Documents, CRM Access, Leaves, Payroll, Live dashboard

## Notes
- Demo uses mock + localStorage (MySQL/Prisma-ready stubs in `src/lib/prisma.ts`)
- Mobile responsive layout with horizontal scroll on wide tables
