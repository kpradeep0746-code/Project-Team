import { DocumentChunk } from '../types';

export const COLLEGE_BASE_URL = 'https://govtpolyproddatur.ac.in/';

export const INITIAL_KNOWLEDGE_BASE: DocumentChunk[] = [
  // --- GENERAL & ABOUT ---
  {
    id: 'gpp-about-01',
    title: 'About Government Polytechnic Proddatur',
    page: 'Home / About Us',
    url: 'https://govtpolyproddatur.ac.in/about',
    department: 'General Administration',
    category: 'General',
    chunk_number: 1,
    last_updated: '2026-07-20',
    content: `Government Polytechnic Proddatur is a premier technical institution established in the year 1959 under the Department of Technical Education, Government of Andhra Pradesh. The college is located at YMR Colony / Holmes Pet Road, Proddatur, YSR Kadapa District, Andhra Pradesh 516360.

The institute is approved by the All India Council for Technical Education (AICTE), New Delhi, and is permanently affiliated with the State Board of Technical Education and Training (SBTET), Andhra Pradesh. Over six decades, Government Polytechnic Proddatur has built a strong reputation for imparting practical technical education to rural and semi-urban students in the Rayalaseema region.

Key Highlights:
• Institution Type: Government Technical Institution
• Established: 1959
• Affiliation: SBTET Andhra Pradesh
• Approval: AICTE New Delhi
• College Code: 015 / GPP
• Campus Area: Spacious green campus with dedicated instructional blocks, laboratories, workshops, administrative building, library, sports ground, and hostels.`,
  },
  {
    id: 'gpp-about-02',
    title: 'Vision and Mission of Government Polytechnic Proddatur',
    page: 'About Us / Vision & Mission',
    url: 'https://govtpolyproddatur.ac.in/about/vision-mission',
    department: 'General Administration',
    category: 'General',
    chunk_number: 2,
    last_updated: '2026-07-20',
    content: `Vision of Government Polytechnic Proddatur:
To emerge as a center of excellence in technical education by imparting value-based diploma engineering education, fostering practical skills, innovation, and ethical leadership to serve industry and society.

Mission of Government Polytechnic Proddatur:
1. To provide quality technical education and hands-on laboratory experience aligned with current industry standards.
2. To cultivate analytical thinking, problem-solving abilities, and lifelong learning habits among engineering diploma students.
3. To encourage industrial training, internships, expert guest lectures, and campus placement drives.
4. To instill moral values, professional ethics, safety consciousness, and social responsibility in future technicians.`,
  },

  // --- ADMINISTRATION & PRINCIPAL ---
  {
    id: 'gpp-admin-01',
    title: 'Principal and Key Administration Details',
    page: 'Administration / Principal Desk',
    url: 'https://govtpolyproddatur.ac.in/administration/principal',
    department: 'General Administration',
    category: 'Administration',
    chunk_number: 1,
    last_updated: '2026-07-20',
    content: `Principal Details:
According to the official Government Polytechnic Proddatur records:
• Principal Name: Sri P. Gurumurthy Reddy
• Designation: Principal & Head of Institution
• Email: gppddr.015@gmail.com / principal.gppr@ap.gov.in
• Phone: 08564-252134
• Office Location: Administrative Block, First Floor, Govt Polytechnic Proddatur.

Principal's Message:
"Welcome to Government Polytechnic Proddatur. Technical education is the backbone of national industrial development. Our objective is to equip diploma students with robust domain fundamentals, practical skills in modern workshops and software, and strong ethical values. We strive to provide excellent training and placement support so our diploma holders excel in industries or pursue higher education (ECET B.Tech entry)."`,
  },

  // --- DEPARTMENTS & FACULTY ---
  {
    id: 'gpp-dept-civil',
    title: 'Civil Engineering Department Details & HOD',
    page: 'Departments / Civil Engineering',
    url: 'https://govtpolyproddatur.ac.in/departments/civil',
    department: 'Civil Engineering',
    category: 'Departments',
    chunk_number: 1,
    last_updated: '2026-07-20',
    content: `Department of Civil Engineering (DCE):
The Civil Engineering department is one of the oldest departments established at Govt Polytechnic Proddatur. It offers a 3-year Diploma in Civil Engineering.

• HOD Civil Engineering: Head of Department (Civil Engineering)
• Intake Capacity: 60 seats per academic year
• Key Subjects: Surveying, Mechanics of Solids, Hydraulics, Building Materials & Construction, Structural Engineering, Transportation Engineering, Environmental Engineering, Estimating & Costing, AutoCAD & Construction Management.
• Laboratories: Surveying Lab (Total Station, Theodolite), Concrete & Highway Lab, Fluid Mechanics Lab, CAD Lab, Material Testing Lab.
• Career Prospects: Site Engineer, Surveyor, Junior Engineer (AP PSC / Irrigation / R&B / Panchayat Raj), CAD Designer, and higher studies via AP ECET.`,
  },
  {
    id: 'gpp-dept-mech',
    title: 'Mechanical Engineering Department Details & HOD',
    page: 'Departments / Mechanical Engineering',
    url: 'https://govtpolyproddatur.ac.in/departments/mechanical',
    department: 'Mechanical Engineering',
    category: 'Departments',
    chunk_number: 1,
    last_updated: '2026-07-20',
    content: `Department of Mechanical Engineering (DME):
The Mechanical Engineering department offers a 3-year Diploma in Mechanical Engineering with state-of-the-art workshops and machine tools.

• Head of Department (HOD Mechanical): Senior Lecturer & HOD Mechanical Engineering.
• Intake Capacity: 60 seats per academic year
• Key Subjects: Thermal Engineering, Manufacturing Technology, Hydraulics & Pneumatics, Industrial Engineering, CAD/CAM, Machine Drawing, Automobile Engineering.
• Laboratories & Workshops: Machine Shop (Lathes, Milling, Drilling, Shaping), Fitting Shop, Foundry & Welding Shop, Thermal Engineering Lab, Metrology Lab, CAD/CAM Lab.
• Industrial Exposure: Mandatory 6-month industrial training in 5th/6th semester.`,
  },
  {
    id: 'gpp-dept-eee',
    title: 'Electrical & Electronics Engineering (EEE) Department',
    page: 'Departments / Electrical & Electronics Engineering',
    url: 'https://govtpolyproddatur.ac.in/departments/eee',
    department: 'Electrical & Electronics Engineering',
    category: 'Departments',
    chunk_number: 1,
    last_updated: '2026-07-20',
    content: `Department of Electrical & Electronics Engineering (DEEE):
Offers a 3-year Diploma in EEE focusing on electrical power systems, power electronics, electrical machinery, and renewable energy.

• Head of Department (HOD EEE): Senior Lecturer & HOD EEE.
• Intake Capacity: 60 seats per academic year
• Key Subjects: D.C. & A.C. Machines, Power Electronics, Electrical Power Systems, Transmission & Distribution, Microcontrollers, Industrial Drives, Electrical Estimation & Safety.
• Laboratories: Electrical Machines Lab, Power Electronics Lab, Electrical Wiring & Servicing Shop, Microcontroller & PLC Lab, Measurement Lab.
• Career Paths: AP TRANSCO, AP GENCO, DISCOMs (SPDCL), Junior Sub-Engineer, Electrical Contractor, Renewable Energy firms.`,
  },
  {
    id: 'gpp-dept-ece',
    title: 'Electronics & Communication Engineering (ECE) Department & HOD',
    page: 'Departments / Electronics & Communication Engineering',
    url: 'https://govtpolyproddatur.ac.in/departments/ece',
    department: 'Electronics & Communication Engineering',
    category: 'Departments',
    chunk_number: 1,
    last_updated: '2026-07-20',
    content: `Department of Electronics & Communication Engineering (DECE):
Offers a 3-year Diploma in ECE specializing in electronic circuits, telecommunications, digital signal processing, microcontrollers, and IoT.

• Head of Department (HOD ECE): Senior Lecturer & HOD ECE.
• Intake Capacity: 60 seats per academic year
• Key Subjects: Electronic Devices & Circuits, Digital Electronics, Communication Systems, Embedded Systems, VLSI Design, Microprocessors (8086 / ARM), Computer Networks, Mobile Communication.
• Laboratories: EDC Lab, Digital Electronics & Microprocessor Lab, Communication Lab, PCB Design & Embedded Systems Lab.
• Placements: Electronics manufacturing units, Telecom companies, Embedded hardware startups, ISRO / DRDO apprentice positions.`,
  },
  {
    id: 'gpp-dept-cme',
    title: 'Computer Engineering (CME) Department Details',
    page: 'Departments / Computer Engineering',
    url: 'https://govtpolyproddatur.ac.in/departments/computer-engineering',
    department: 'Computer Engineering',
    category: 'Departments',
    chunk_number: 1,
    last_updated: '2026-07-20',
    content: `Department of Computer Engineering (DCME):
Offers a 3-year Diploma in Computer Engineering designed to impart software development, networking, web development, data structures, and database administration skills.

• Head of Department (HOD Computer Engineering): Senior Lecturer & HOD CME.
• Intake Capacity: 60 seats per academic year
• Key Subjects: C Programming, Object Oriented Programming with C++/Java, Data Structures, Operating Systems, DBMS & SQL, Web Technologies (HTML/CSS/JS), Python Programming, Computer Hardware & Networking, Software Engineering.
• Laboratories: High-Speed Computer Center (100+ Systems with LAN & Fiber Internet), Programming Lab, Web Technologies Lab, Hardware & Networking Lab.
• Opportunities: Software Trainee, Web Developer, System Administrator, IT Support Engineer.`,
  },

  // --- ADMISSIONS & FEE STRUCTURE ---
  {
    id: 'gpp-admissions-01',
    title: 'Admission Eligibility, Process, and POLYCET',
    page: 'Admissions / Eligibility & Process',
    url: 'https://govtpolyproddatur.ac.in/admissions/eligibility',
    department: 'Admissions',
    category: 'Admissions',
    chunk_number: 1,
    last_updated: '2026-07-20',
    content: `Admissions at Government Polytechnic Proddatur:
All admissions to 3-year Diploma courses are made strictly on the basis of rank obtained in POLYCET (Polytechnic Common Entrance Test) conducted annually by State Board of Technical Education and Training (SBTET), Andhra Pradesh.

Eligibility Criteria:
1. Academic Qualification: Passed SSC (10th Class) examination conducted by Board of Secondary Education, AP, or any equivalent exam recognized by AP Board.
2. Minimum Marks: Candidate must have passed 10th with Mathematics as one of the subjects.
3. Age Limit: No upper age limit for POLYCET AP.
4. AP Domicile / Local Status: Candidates belonging to AP state under local / non-local reservation rules defined by AP Govt.

Admission Steps:
1. Appear for AP POLYCET entrance exam.
2. Web Counseling & Option Entry on official AP POLYCET portal.
3. Allotment of seat at Govt Polytechnic Proddatur (Institute Code: 015).
4. Physical Document Verification & Fee Payment at College Office.`,
  },
  {
    id: 'gpp-fee-01',
    title: 'Tuition Fee Structure and Govt Scholarships',
    page: 'Admissions / Fee Details & Scholarships',
    url: 'https://govtpolyproddatur.ac.in/admissions/fee-structure',
    department: 'Admissions & Accounts',
    category: 'Admissions',
    chunk_number: 2,
    last_updated: '2026-07-20',
    content: `Tuition Fee Structure (Government Prescribed):
As a Government institution, fees are nominal and strictly regulated by the Department of Technical Education, AP:

Fee Breakdown per Academic Year:
• Tuition Fee: ~Rs. 2,000 / year
• Special Fee & Lab Maintenance: ~Rs. 1,500 / year
• Admission & Registration Fee (1st Year): ~Rs. 300
• Caution Deposit (Refundable): ~Rs. 500
• Total Approximate Annual Fee: ~Rs. 4,700 to Rs. 5,000 per year.

Fee Reimbursement & Government Scholarships:
• Jagananna Vidya Deevena (JVD): Full tuition fee reimbursement for eligible SC, ST, BC, EBC, Minority, and Kapu students whose annual family income is below prescribed government thresholds.
• Jagananna Vasathi Deevena (JVD Hostel/Mess Scheme): Financial assistance provided directly to mothers' bank accounts to cover hostel & mess expenses (~Rs. 10,000 to Rs. 15,000/year).
• National Scholarship Portal (NSP) schemes available for eligible minority & physically challenged students.`,
  },

  // --- TRAINING & PLACEMENTS ---
  {
    id: 'gpp-placements-01',
    title: 'Training & Placement Cell (TPC) and Recruiter Companies',
    page: 'Placements / Overview & Recruiters',
    url: 'https://govtpolyproddatur.ac.in/placements/overview',
    department: 'Training & Placement',
    category: 'Placements',
    chunk_number: 1,
    last_updated: '2026-07-20',
    content: `Training & Placement Cell (TPC):
The Training & Placement Cell at Government Polytechnic Proddatur is active in arranging campus interviews, industrial visits, skill development programs, soft skills training, and mandatory 6-month industrial internships.

Major Recruiting Companies & Organizations:
• TATA Motors & TATA Projects
• L&T (Larsen & Toubro Construction)
• Kia India Motors (Anantapur plant)
• Medha Servo Drives
• Schneider Electric
• Greenko Group (Renewable Energy)
• AP Transco & AP Discom apprenticeships
• Amararaja Batteries Limited
• Delphi-TVS
• Various local infrastructure and manufacturing industries in AP.

Placement Highlights:
• Average Salary Package: Rs. 1.8 LPA to Rs. 3.2 LPA for diploma freshers.
• Higher Education Route: Over 40% of diploma graduates clear AP ECET to secure direct 2nd-year Lateral Entry B.Tech admission in top engineering colleges across AP.`,
  },

  // --- FACILITIES & HOSTEL ---
  {
    id: 'gpp-facilities-01',
    title: 'Campus Facilities, Hostel, Library, and Sports',
    page: 'Facilities / Library & Hostel',
    url: 'https://govtpolyproddatur.ac.in/facilities/overview',
    department: 'General Facilities',
    category: 'Facilities',
    chunk_number: 1,
    last_updated: '2026-07-20',
    content: `Campus Infrastructure & Facilities:

1. Central Library:
• Houses over 15,000 technical textbooks, reference manuals, state board syllabi, and technical magazines.
• Digital library corner with internet access for e-learning resources.

2. Hostel Facilities:
• Government Boys Hostel and Girls Hostel within / near campus premise.
• Hygienic mess providing nutritious meals.
• 24x7 security, clean drinking water (RO plant), and warden supervision.

3. Computer & Internet Facilities:
• Dedicated computer labs with 100+ modern PCs and high-speed broadband connection for student practicals.

4. Sports & Extra-Curricular:
• Spacious sports field for Cricket, Volleyball, Kabaddi, Badminton, and Athletics.
• Annual Inter-Polytechnic Sports Meet (IPSME) participation.
• NSS (National Service Scheme) unit conducting blood donation camps, tree planting drives, and rural awareness rallies.`,
  },

  // --- ACADEMIC RULES & TIMINGS ---
  {
    id: 'gpp-rules-01',
    title: 'College Timings, Attendance Rules, and Academic Calendar',
    page: 'Academics / Rules & Regulations',
    url: 'https://govtpolyproddatur.ac.in/academics/rules',
    department: 'Academic Section',
    category: 'Rules',
    chunk_number: 1,
    last_updated: '2026-07-20',
    content: `College Timings and Rules:
• Operating Hours: 9:30 AM to 5:00 PM (Monday through Saturday).
• Lunch Break: 1:00 PM to 2:00 PM.

Attendance Regulations (SBTET AP Guidelines):
• Minimum 75% attendance is strictly mandatory in theory and practical classes to appear for end-semester SBTET diploma examinations.
• Condonation for attendance between 65% and 74% is granted only on genuine medical grounds accompanied by a valid medical certificate and condonation fee.
• Less than 65% attendance leads to detention for that academic year.

Dress Code & ID Cards:
• All students must wear the prescribed department uniform during regular working days and laboratory practicals.
• Wearing college Student ID card is compulsory inside campus premises.
• Ragging is strictly forbidden under the AP Prohibition of Ragging Act. Zero tolerance policy.`,
  },

  // --- CONTACT INFORMATION ---
  {
    id: 'gpp-contact-01',
    title: 'Official Contact Information and Address',
    page: 'Contact Us',
    url: 'https://govtpolyproddatur.ac.in/contact',
    department: 'General Office',
    category: 'General',
    chunk_number: 1,
    last_updated: '2026-07-20',
    content: `Government Polytechnic Proddatur Contact Details:
• Official Name: Government Polytechnic, Proddatur
• Address: YMR Colony / Holmes Pet Road, Proddatur, YSR Kadapa District, Andhra Pradesh - 516360, India.
• Website: https://govtpolyproddatur.ac.in/
• Office Phone Number: 08564-252134
• Official Email: gppddr.015@gmail.com / principal.gppr@ap.gov.in
• College Code: 015
• Working Hours: Monday to Saturday, 9:30 AM - 5:00 PM.`,
  },
];
