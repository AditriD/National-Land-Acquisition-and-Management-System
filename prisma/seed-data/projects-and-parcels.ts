/**
 * prisma/seed-data/projects-and-parcels.ts
 *
 * Seed data for the "Projects + LandParcels" team task (SIH26016).
 * Built from the Telangana / Assam / Maharashtra research datasets —
 * every project name, state, sector, and implementing agency is real.
 *
 * Usage from your main prisma/seed.ts:
 *
 *   import { seedProjectsAndLandParcels } from "./seed-data/projects-and-parcels";
 *   // ... after you've seeded Users ...
 *   await seedProjectsAndLandParcels(prisma);
 */

import { PrismaClient, Stage, RiskLevel, CompensationStatus } from '@prisma/client'

// Relative dates so the seed stays realistic no matter when it's run.
const daysAgo = (n: number) => new Date(Date.now() - n * 24 * 60 * 60 * 1000);

// ===================================================================
// PROJECTS (18 real projects — 6 Telangana, 6 Assam, 6 Maharashtra)
// ===================================================================

interface ProjectSeedInput {
  name: string;
  ministry: string;
  implementingAgency: string;
  state: string;
  sector: string;
  targetCompletion?: Date;
}

const projectsSeed: ProjectSeedInput[] = [
  // --- Telangana (0-5) ---
  {
    name: "Hyderabad Regional Ring Road (RRR) — Northern part, NH161AA",
    ministry: "Ministry of Road Transport and Highways (MoRTH)",
    implementingAgency: "National Highways Authority of India (NHAI)",
    state: "Telangana",
    sector: "Highway",
  },
  {
    name: "Kothapalli–Manoharabad new railway line",
    ministry: "Ministry of Railways",
    implementingAgency: "South Central Railway (Indian Railways)",
    state: "Telangana",
    sector: "Railway",
    targetCompletion: new Date("2025-03-31"),
  },
  {
    name: "Bodhan–Latur Road new railway line",
    ministry: "Ministry of Railways",
    implementingAgency: "South Central Railway (Indian Railways)",
    state: "Telangana",
    sector: "Railway",
  },
  {
    name: "Kaleshwaram Lift Irrigation Project (Medigadda Barrage)",
    ministry: "Ministry of Jal Shakti (Department of Water Resources, River Development and Ganga Rejuvenation)",
    implementingAgency: "Telangana Irrigation & CAD Department",
    state: "Telangana",
    sector: "Irrigation",
  },
  {
    name: "Palamuru–Rangareddy Lift Irrigation Scheme (PRLIS)",
    ministry: "Ministry of Jal Shakti (Department of Water Resources, River Development and Ganga Rejuvenation)",
    implementingAgency: "Telangana Irrigation & CAD Department",
    state: "Telangana",
    sector: "Irrigation",
  },
  {
    name: "Mahatma Gandhi Kalwakurthy Lift Irrigation Scheme (MGKLIS)",
    ministry: "Ministry of Jal Shakti (Department of Water Resources, River Development and Ganga Rejuvenation)",
    implementingAgency: "Telangana Irrigation & CAD Department",
    state: "Telangana",
    sector: "Irrigation",
  },
  // --- Assam (6-11) ---
  {
    name: "LGBI Airport (Borjhar)–Jalukbari 6-Lane Elevated Corridor",
    ministry: "Ministry of Road Transport and Highways (MoRTH)",
    implementingAgency: "National Highways Authority of India (NHAI)",
    state: "Assam",
    sector: "Highway",
  },
  {
    name: "Kokrajhar–Gelephu new railway line (India–Bhutan link)",
    ministry: "Ministry of Railways",
    implementingAgency: "Northeast Frontier Railway (NFR)",
    state: "Assam",
    sector: "Railway",
  },
  {
    name: "Murkongselek–Pasighat railway line",
    ministry: "Ministry of Railways",
    implementingAgency: "Northeast Frontier Railway (NFR)",
    state: "Assam",
    sector: "Railway",
  },
  {
    name: "Dimapur (Dhansiri)–Kohima (Zubza) new railway line",
    ministry: "Ministry of Railways",
    implementingAgency: "Northeast Frontier Railway (NFR)",
    state: "Assam",
    sector: "Railway",
    targetCompletion: new Date("2029-12-31"),
  },
  {
    name: "Sukla FIS (Flow Irrigation Scheme)",
    ministry: "Ministry of Jal Shakti (Department of Water Resources, River Development and Ganga Rejuvenation)",
    implementingAgency: "Assam Irrigation Department",
    state: "Assam",
    sector: "Irrigation",
  },
  {
    name: "Jamuna Irrigation Scheme",
    ministry: "Ministry of Jal Shakti (Department of Water Resources, River Development and Ganga Rejuvenation)",
    implementingAgency: "Assam Irrigation Department",
    state: "Assam",
    sector: "Irrigation",
  },
  // --- Maharashtra (12-17) ---
  {
    name: "Vadhavan Port",
    ministry: "Ministry of Ports, Shipping and Waterways",
    implementingAgency: "Vadhavan Port Project Limited (VPPL) — JNPA / Maharashtra Maritime Board",
    state: "Maharashtra",
    sector: "Port",
    targetCompletion: new Date("2034-12-31"),
  },
  {
    name: "Navi Mumbai International Airport (NMIA)",
    ministry: "Ministry of Civil Aviation",
    implementingAgency: "Navi Mumbai International Airport Ltd. (NMIAL)",
    state: "Maharashtra",
    sector: "Aviation",
  },
  {
    name: "Hindu Hrudaysamrat Balasaheb Thackeray Maharashtra Samruddhi Mahamarg (Mumbai-Nagpur Expressway)",
    ministry: "Ministry of Road Transport and Highways (MoRTH)",
    implementingAgency: "Maharashtra State Road Development Corporation (MSRDC)",
    state: "Maharashtra",
    sector: "Highway",
  },
  {
    name: "Wardha–Yavatmal–Nanded new railway line (via Kalamb, Digras, Pusad)",
    ministry: "Ministry of Railways",
    implementingAgency: "Central Railway / Rail Vikas Nigam Ltd. (RVNL)",
    state: "Maharashtra",
    sector: "Railway",
  },
  {
    name: "Mumbai–Ahmedabad High Speed Rail (Bullet Train), Maharashtra segment",
    ministry: "Ministry of Railways",
    implementingAgency: "National High Speed Rail Corporation Limited (NHSRCL)",
    state: "Maharashtra",
    sector: "Railway",
  },
  {
    name: "Gosikhurd National Irrigation Project (Indira Sagar)",
    ministry: "Ministry of Jal Shakti (Department of Water Resources, River Development and Ganga Rejuvenation)",
    implementingAgency: "Maharashtra Water Resources Department (VIDC)",
    state: "Maharashtra",
    sector: "Irrigation",
  },
];

// ===================================================================
// LAND PARCELS (50 total, staggered across the 18 projects above)
// ===================================================================

interface LandParcelSeedInput {
  projectIndex: number;
  district?: string;
  surveyNumber: string;
  latitude: number;
  longitude: number;
  areaHectares: number;
  status: Stage;
  enteredStageAt: Date;
  awardDate?: Date;
  compensationAmount?: number;
  compensationPaid?: number;
  compensationStatus: CompensationStatus;
  hasDispute: boolean;
  disputeNotes?: string;
  ownerName?: string;
  ownerPhone?: string;
  riskLevel?: RiskLevel;
  riskReason?: string;
  riskUpdatedAt?: Date;
}

const landParcelsSeed: LandParcelSeedInput[] = [
  // --- Project 0: RRR Northern (3) ---
  {
    projectIndex: 0, district: "Sangareddy", surveyNumber: "142/3A",
    latitude: 17.6301, longitude: 78.0790, areaHectares: 2.4,
    status: Stage.UNDER_SCRUTINY, enteredStageAt: daysAgo(35),
    compensationStatus: CompensationStatus.PENDING, hasDispute: false,
    ownerName: "K. Ramesh Reddy", ownerPhone: "9848012345",
  },
  {
    projectIndex: 0, district: "Medak", surveyNumber: "88/2",
    latitude: 17.6180, longitude: 78.0955, areaHectares: 1.1,
    status: Stage.NOTIFICATION_ISSUED, enteredStageAt: daysAgo(60),
    compensationStatus: CompensationStatus.PENDING, hasDispute: false,
    ownerName: "S. Lakshmi Devi", ownerPhone: "9849023456",
  },
  {
    projectIndex: 0, district: "Siddipet", surveyNumber: "215/1B",
    latitude: 17.6412, longitude: 78.0733, areaHectares: 3.6,
    status: Stage.AWARD_DECLARED, enteredStageAt: daysAgo(540),
    awardDate: daysAgo(540),
    compensationAmount: 4200000, compensationPaid: 0,
    compensationStatus: CompensationStatus.PENDING,
    hasDispute: true, disputeNotes: "Boundary dispute between two claimant families; matter pending before Sub-Collector.",
    riskLevel: RiskLevel.HIGH,
    riskReason: "Award declared 540+ days ago with zero compensation paid — Section 24(2) lapse risk.",
    riskUpdatedAt: daysAgo(2),
  },

  // --- Project 1: Kothapalli–Manoharabad (3) ---
  {
    projectIndex: 1, district: "Medak", surveyNumber: "56/1",
    latitude: 17.7601, longitude: 78.4489, areaHectares: 0.8,
    status: Stage.PROPOSAL_SUBMITTED, enteredStageAt: daysAgo(12),
    compensationStatus: CompensationStatus.PENDING, hasDispute: false,
  },
  {
    projectIndex: 1, district: "Karimnagar", surveyNumber: "301/4",
    latitude: 17.7488, longitude: 78.4612, areaHectares: 1.9,
    status: Stage.NOTIFICATION_ISSUED, enteredStageAt: daysAgo(75),
    compensationStatus: CompensationStatus.PENDING, hasDispute: false,
    ownerName: "M. Venkataiah", ownerPhone: "9840112233",
  },
  {
    projectIndex: 1, district: "Medak", surveyNumber: "62/3A",
    latitude: 17.7580, longitude: 78.4501, areaHectares: 1.3,
    status: Stage.COMPENSATION_DISBURSED, enteredStageAt: daysAgo(210),
    awardDate: daysAgo(280),
    compensationAmount: 1850000, compensationPaid: 1850000,
    compensationStatus: CompensationStatus.PAID, hasDispute: false,
    ownerName: "P. Anjaiah", ownerPhone: "9841122334",
  },

  // --- Project 2: Bodhan–Latur Road (2) ---
  {
    projectIndex: 2, district: "Nizamabad", surveyNumber: "17/2",
    latitude: 18.6752, longitude: 77.9061, areaHectares: 2.1,
    status: Stage.PROPOSAL_SUBMITTED, enteredStageAt: daysAgo(8),
    compensationStatus: CompensationStatus.PENDING, hasDispute: false,
  },
  {
    projectIndex: 2, district: "Nizamabad", surveyNumber: "44/1B",
    latitude: 18.6689, longitude: 77.8995, areaHectares: 1.6,
    status: Stage.UNDER_SCRUTINY, enteredStageAt: daysAgo(28),
    compensationStatus: CompensationStatus.PENDING, hasDispute: false,
    ownerName: "G. Sujatha", ownerPhone: "9842233445",
  },

  // --- Project 3: Kaleshwaram (4) ---
  {
    projectIndex: 3, district: "Jayashankar Bhupalpally", surveyNumber: "9/1",
    latitude: 17.7432, longitude: 78.6928, areaHectares: 5.2,
    status: Stage.AWARD_DECLARED, enteredStageAt: daysAgo(150),
    awardDate: daysAgo(150),
    compensationAmount: 6100000, compensationPaid: 3050000,
    compensationStatus: CompensationStatus.PARTIAL, hasDispute: false,
  },
  {
    projectIndex: 3, district: "Jayashankar Bhupalpally", surveyNumber: "11/4A",
    latitude: 17.7385, longitude: 78.6881, areaHectares: 3.9,
    status: Stage.COMPENSATION_DISBURSED, enteredStageAt: daysAgo(300),
    awardDate: daysAgo(380),
    compensationAmount: 4500000, compensationPaid: 4500000,
    compensationStatus: CompensationStatus.PAID, hasDispute: false,
    ownerName: "T. Narsimha Rao", ownerPhone: "9843344556",
  },
  {
    projectIndex: 3, district: "Jayashankar Bhupalpally", surveyNumber: "14/2",
    latitude: 17.7460, longitude: 78.6802, areaHectares: 2.7,
    status: Stage.POSSESSION_TAKEN, enteredStageAt: daysAgo(400),
    awardDate: daysAgo(500),
    compensationAmount: 3200000, compensationPaid: 3200000,
    compensationStatus: CompensationStatus.PAID, hasDispute: false,
    ownerName: "B. Yadagiri", ownerPhone: "9844455667",
  },
  {
    projectIndex: 3, district: "Jayashankar Bhupalpally", surveyNumber: "22/1C",
    latitude: 17.7501, longitude: 78.6959, areaHectares: 4.4,
    status: Stage.POSSESSION_TAKEN, enteredStageAt: daysAgo(650),
    awardDate: daysAgo(720),
    compensationAmount: 5300000, compensationPaid: 5300000,
    compensationStatus: CompensationStatus.PAID,
    hasDispute: true, disputeNotes: "Resettlement site allotment contested by affected families; R&R not yet complete after 21 months.",
    riskLevel: RiskLevel.HIGH,
    riskReason: "Possession taken 650+ days ago; R&R still not completed — stalled at final stage.",
    riskUpdatedAt: daysAgo(3),
  },

  // --- Project 4: PRLIS (3) ---
  {
    projectIndex: 4, district: "Nagarkurnool", surveyNumber: "3/1A",
    latitude: 15.9678, longitude: 78.1502, areaHectares: 6.5,
    status: Stage.UNDER_SCRUTINY, enteredStageAt: daysAgo(40),
    compensationStatus: CompensationStatus.PENDING, hasDispute: false,
  },
  {
    projectIndex: 4, district: "Mahabubnagar", surveyNumber: "18/2",
    latitude: 15.9591, longitude: 78.1421, areaHectares: 3.8,
    status: Stage.NOTIFICATION_ISSUED, enteredStageAt: daysAgo(85),
    compensationStatus: CompensationStatus.PENDING, hasDispute: false,
    ownerName: "R. Chandramma", ownerPhone: "9845566778",
  },
  {
    projectIndex: 4, district: "Nagarkurnool", surveyNumber: "27/3B",
    latitude: 15.9720, longitude: 78.1388, areaHectares: 8.1,
    status: Stage.AWARD_DECLARED, enteredStageAt: daysAgo(610),
    awardDate: daysAgo(610),
    compensationAmount: 9200000, compensationPaid: 1500000,
    compensationStatus: CompensationStatus.PARTIAL,
    hasDispute: false,
    riskLevel: RiskLevel.HIGH,
    riskReason: "Award declared 600+ days ago; only ~16% of compensation disbursed — high lapse risk under Section 24(2).",
    riskUpdatedAt: daysAgo(1),
  },

  // --- Project 5: MGKLIS (3) ---
  {
    projectIndex: 5, district: "Mahabubnagar", surveyNumber: "5/2",
    latitude: 16.1034, longitude: 78.3971, areaHectares: 2.9,
    status: Stage.COMPENSATION_DISBURSED, enteredStageAt: daysAgo(190),
    awardDate: daysAgo(260),
    compensationAmount: 2600000, compensationPaid: 2600000,
    compensationStatus: CompensationStatus.PAID, hasDispute: false,
    ownerName: "V. Krishnaiah", ownerPhone: "9846677889",
  },
  {
    projectIndex: 5, district: "Mahabubnagar", surveyNumber: "9/1B",
    latitude: 16.0989, longitude: 78.4025, areaHectares: 1.5,
    status: Stage.POSSESSION_TAKEN, enteredStageAt: daysAgo(320),
    awardDate: daysAgo(400),
    compensationAmount: 1450000, compensationPaid: 1450000,
    compensationStatus: CompensationStatus.PAID, hasDispute: false,
  },
  {
    projectIndex: 5, district: "Mahabubnagar", surveyNumber: "13/4",
    latitude: 16.1058, longitude: 78.3902, areaHectares: 3.3,
    status: Stage.AWARD_DECLARED, enteredStageAt: daysAgo(95),
    awardDate: daysAgo(95),
    compensationAmount: 3900000, compensationPaid: 1300000,
    compensationStatus: CompensationStatus.PARTIAL,
    hasDispute: true, disputeNotes: "Joint-ownership claim — two legal heirs dispute compensation split.",
    ownerName: "D. Bhaskar Rao", ownerPhone: "9847788990",
  },

  // --- Project 6: LGBI–Jalukbari (2) ---
  {
    projectIndex: 6, district: "Kamrup Metropolitan", surveyNumber: "112/1",
    latitude: 26.1467, longitude: 91.6392, areaHectares: 0.6,
    status: Stage.PROPOSAL_SUBMITTED, enteredStageAt: daysAgo(15),
    compensationStatus: CompensationStatus.PENDING, hasDispute: false,
  },
  {
    projectIndex: 6, district: "Kamrup Metropolitan", surveyNumber: "97/2A",
    latitude: 26.1421, longitude: 91.6455, areaHectares: 0.9,
    status: Stage.PROPOSAL_SUBMITTED, enteredStageAt: daysAgo(10),
    compensationStatus: CompensationStatus.PENDING, hasDispute: false,
    ownerName: "D. Baruah", ownerPhone: "9435112233",
  },

  // --- Project 7: Kokrajhar–Gelephu (3) ---
  {
    projectIndex: 7, district: "Kokrajhar", surveyNumber: "204/1",
    latitude: 26.4089, longitude: 90.2695, areaHectares: 1.7,
    status: Stage.PROPOSAL_SUBMITTED, enteredStageAt: daysAgo(20),
    compensationStatus: CompensationStatus.PENDING, hasDispute: false,
  },
  {
    projectIndex: 7, district: "Kokrajhar", surveyNumber: "188/3B",
    latitude: 26.4012, longitude: 90.2788, areaHectares: 2.2,
    status: Stage.UNDER_SCRUTINY, enteredStageAt: daysAgo(45),
    compensationStatus: CompensationStatus.PENDING, hasDispute: false,
    ownerName: "R. Basumatary", ownerPhone: "9435223344",
  },
  {
    projectIndex: 7, district: "Kokrajhar", surveyNumber: "175/2",
    latitude: 26.3998, longitude: 90.2645, areaHectares: 1.4,
    status: Stage.NOTIFICATION_ISSUED, enteredStageAt: daysAgo(70),
    compensationStatus: CompensationStatus.PENDING, hasDispute: false,
  },

  // --- Project 8: Murkongselek–Pasighat (2) ---
  {
    projectIndex: 8, district: "Dhemaji", surveyNumber: "61/1A",
    latitude: 27.8324, longitude: 95.2145, areaHectares: 1.0,
    status: Stage.NOTIFICATION_ISSUED, enteredStageAt: daysAgo(55),
    compensationStatus: CompensationStatus.PENDING, hasDispute: false,
    ownerName: "J. Payeng", ownerPhone: "9435334455",
  },
  {
    projectIndex: 8, district: "Dhemaji", surveyNumber: "73/2",
    latitude: 27.8255, longitude: 95.2231, areaHectares: 1.8,
    status: Stage.AWARD_DECLARED, enteredStageAt: daysAgo(500),
    awardDate: daysAgo(500),
    compensationAmount: 1250000, compensationPaid: 400000,
    compensationStatus: CompensationStatus.PARTIAL,
    hasDispute: false,
    riskLevel: RiskLevel.HIGH,
    riskReason: "Award declared 500+ days ago with compensation only partially disbursed — Section 24(2) lapse risk.",
    riskUpdatedAt: daysAgo(4),
  },

  // --- Project 9: Dimapur–Kohima (3) ---
  {
    projectIndex: 9, district: "Karbi Anglong", surveyNumber: "31/1",
    latitude: 25.8412, longitude: 93.4340, areaHectares: 2.5,
    status: Stage.UNDER_SCRUTINY, enteredStageAt: daysAgo(38),
    compensationStatus: CompensationStatus.PENDING, hasDispute: false,
  },
  {
    projectIndex: 9, district: "Karbi Anglong", surveyNumber: "48/2B",
    latitude: 25.8355, longitude: 93.4421, areaHectares: 1.9,
    status: Stage.AWARD_DECLARED, enteredStageAt: daysAgo(90),
    awardDate: daysAgo(90),
    compensationAmount: 2100000, compensationPaid: 700000,
    compensationStatus: CompensationStatus.PARTIAL, hasDispute: false,
    ownerName: "T. Teron", ownerPhone: "9436445566",
  },
  {
    projectIndex: 9, district: "Karbi Anglong", surveyNumber: "55/1",
    latitude: 25.8298, longitude: 93.4467, areaHectares: 3.4,
    status: Stage.NOTIFICATION_ISSUED, enteredStageAt: daysAgo(480),
    compensationStatus: CompensationStatus.PENDING,
    hasDispute: true, disputeNotes: "Community land ownership contested by village council; notification challenged in court.",
    riskLevel: RiskLevel.HIGH,
    riskReason: "Notification issued 480+ days ago with no progress to award stage — stalled due to ownership dispute.",
    riskUpdatedAt: daysAgo(6),
  },

  // --- Project 10: Sukla FIS (3) ---
  {
    projectIndex: 10, district: "Baksa", surveyNumber: "14/3",
    latitude: 26.6578, longitude: 91.7112, areaHectares: 1.2,
    status: Stage.COMPENSATION_DISBURSED, enteredStageAt: daysAgo(160),
    awardDate: daysAgo(220),
    compensationAmount: 980000, compensationPaid: 980000,
    compensationStatus: CompensationStatus.PAID, hasDispute: false,
    ownerName: "P. Boro", ownerPhone: "9435556677",
  },
  {
    projectIndex: 10, district: "Baksa", surveyNumber: "21/1A",
    latitude: 26.6512, longitude: 91.7189, areaHectares: 0.9,
    status: Stage.POSSESSION_TAKEN, enteredStageAt: daysAgo(280),
    awardDate: daysAgo(340),
    compensationAmount: 750000, compensationPaid: 750000,
    compensationStatus: CompensationStatus.PAID, hasDispute: false,
  },
  {
    projectIndex: 10, district: "Baksa", surveyNumber: "27/4",
    latitude: 26.6601, longitude: 91.7098, areaHectares: 1.6,
    status: Stage.NOTIFICATION_ISSUED, enteredStageAt: daysAgo(50),
    compensationStatus: CompensationStatus.PENDING, hasDispute: false,
  },

  // --- Project 11: Jamuna Irrigation Scheme (2) ---
  {
    projectIndex: 11, district: "Karbi Anglong", surveyNumber: "6/2",
    latitude: 26.0532, longitude: 93.1855, areaHectares: 3.1,
    status: Stage.AWARD_DECLARED, enteredStageAt: daysAgo(70),
    awardDate: daysAgo(70),
    compensationAmount: 2750000, compensationPaid: 900000,
    compensationStatus: CompensationStatus.PARTIAL, hasDispute: false,
    ownerName: "H. Engleng", ownerPhone: "9436667788",
  },
  {
    projectIndex: 11, district: "Hojai", surveyNumber: "11/1B",
    latitude: 26.0489, longitude: 93.1755, areaHectares: 2.4,
    status: Stage.COMPENSATION_DISBURSED, enteredStageAt: daysAgo(200),
    awardDate: daysAgo(260),
    compensationAmount: 2100000, compensationPaid: 2100000,
    compensationStatus: CompensationStatus.PAID, hasDispute: false,
  },

  // --- Project 12: Vadhavan Port (4) ---
  {
    projectIndex: 12, district: "Palghar", surveyNumber: "88/1A",
    latitude: 19.9328, longitude: 72.6634, areaHectares: 4.2,
    status: Stage.PROPOSAL_SUBMITTED, enteredStageAt: daysAgo(18),
    compensationStatus: CompensationStatus.PENDING, hasDispute: false,
  },
  {
    projectIndex: 12, district: "Palghar", surveyNumber: "94/2",
    latitude: 19.9271, longitude: 72.6558, areaHectares: 3.0,
    status: Stage.UNDER_SCRUTINY, enteredStageAt: daysAgo(42),
    compensationStatus: CompensationStatus.PENDING, hasDispute: false,
    ownerName: "S. Koli", ownerPhone: "9820112233",
  },
  {
    projectIndex: 12, district: "Palghar", surveyNumber: "101/3B",
    latitude: 19.9355, longitude: 72.6689, areaHectares: 5.5,
    status: Stage.NOTIFICATION_ISSUED, enteredStageAt: daysAgo(65),
    compensationStatus: CompensationStatus.PENDING, hasDispute: false,
  },
  {
    projectIndex: 12, district: "Palghar", surveyNumber: "76/1",
    latitude: 19.9249, longitude: 72.6512, areaHectares: 6.8,
    status: Stage.AWARD_DECLARED, enteredStageAt: daysAgo(460),
    awardDate: daysAgo(460),
    compensationAmount: 8900000, compensationPaid: 0,
    compensationStatus: CompensationStatus.PENDING,
    hasDispute: true, disputeNotes: "Fisherfolk community contests classification of land as non-agricultural; matter before District Collector.",
    riskLevel: RiskLevel.HIGH,
    riskReason: "Award declared 460+ days ago, zero compensation disbursed, active dispute — high lapse risk.",
    riskUpdatedAt: daysAgo(2),
  },

  // --- Project 13: NMIA (3) — mostly complete, airport already operational ---
  {
    projectIndex: 13, district: "Raigad", surveyNumber: "39/2",
    latitude: 18.9978, longitude: 73.0655, areaHectares: 7.4,
    status: Stage.POSSESSION_TAKEN, enteredStageAt: daysAgo(430),
    awardDate: daysAgo(600),
    compensationAmount: 12500000, compensationPaid: 12500000,
    compensationStatus: CompensationStatus.PAID, hasDispute: false,
    ownerName: "A. Patil", ownerPhone: "9822223344",
  },
  {
    projectIndex: 13, district: "Raigad", surveyNumber: "45/1A",
    latitude: 18.9911, longitude: 73.0748, areaHectares: 5.9,
    status: Stage.COMPENSATION_DISBURSED, enteredStageAt: daysAgo(500),
    awardDate: daysAgo(560),
    compensationAmount: 9800000, compensationPaid: 9800000,
    compensationStatus: CompensationStatus.PAID, hasDispute: false,
  },
  {
    projectIndex: 13, district: "Raigad", surveyNumber: "52/3",
    latitude: 19.0002, longitude: 73.0621, areaHectares: 4.1,
    status: Stage.POSSESSION_TAKEN, enteredStageAt: daysAgo(390),
    awardDate: daysAgo(520),
    compensationAmount: 7200000, compensationPaid: 7200000,
    compensationStatus: CompensationStatus.PAID, hasDispute: false,
    ownerName: "N. Mhatre", ownerPhone: "9823334455",
  },

  // --- Project 14: Samruddhi Mahamarg (3) — expressway substantially open ---
  {
    projectIndex: 14, district: "Nagpur", surveyNumber: "23/1",
    latitude: 21.1489, longitude: 79.0845, areaHectares: 2.0,
    status: Stage.POSSESSION_TAKEN, enteredStageAt: daysAgo(600),
    awardDate: daysAgo(720),
    compensationAmount: 3100000, compensationPaid: 3100000,
    compensationStatus: CompensationStatus.PAID, hasDispute: false,
  },
  {
    projectIndex: 14, district: "Nashik", surveyNumber: "67/2B",
    latitude: 19.9975, longitude: 73.7898, areaHectares: 1.7,
    status: Stage.COMPENSATION_DISBURSED, enteredStageAt: daysAgo(340),
    awardDate: daysAgo(410),
    compensationAmount: 2600000, compensationPaid: 2600000,
    compensationStatus: CompensationStatus.PAID, hasDispute: false,
    ownerName: "R. Wagh", ownerPhone: "9860445566",
  },
  {
    projectIndex: 14, district: "Thane", surveyNumber: "18/4",
    latitude: 19.3211, longitude: 73.1245, areaHectares: 1.3,
    status: Stage.NOTIFICATION_ISSUED, enteredStageAt: daysAgo(48),
    compensationStatus: CompensationStatus.PENDING, hasDispute: false,
  },

  // --- Project 15: Wardha–Yavatmal–Nanded (2) ---
  {
    projectIndex: 15, district: "Wardha", surveyNumber: "15/2",
    latitude: 20.7365, longitude: 78.5981, areaHectares: 1.8,
    status: Stage.PROPOSAL_SUBMITTED, enteredStageAt: daysAgo(22),
    compensationStatus: CompensationStatus.PENDING, hasDispute: false,
  },
  {
    projectIndex: 15, district: "Yavatmal", surveyNumber: "29/1A",
    latitude: 20.3888, longitude: 78.1204, areaHectares: 2.6,
    status: Stage.UNDER_SCRUTINY, enteredStageAt: daysAgo(52),
    compensationStatus: CompensationStatus.PENDING, hasDispute: false,
    ownerName: "V. Deshmukh", ownerPhone: "9890556677",
  },

  // --- Project 16: Mumbai–Ahmedabad HSR, Maharashtra segment (2) ---
  {
    projectIndex: 16, district: "Palghar", surveyNumber: "33/1",
    latitude: 19.8065, longitude: 72.7521, areaHectares: 1.5,
    status: Stage.NOTIFICATION_ISSUED, enteredStageAt: daysAgo(58),
    compensationStatus: CompensationStatus.PENDING, hasDispute: false,
  },
  {
    projectIndex: 16, district: "Thane", surveyNumber: "41/2B",
    latitude: 19.1876, longitude: 72.9701, areaHectares: 2.3,
    status: Stage.AWARD_DECLARED, enteredStageAt: daysAgo(110),
    awardDate: daysAgo(110),
    compensationAmount: 3400000, compensationPaid: 1100000,
    compensationStatus: CompensationStatus.PARTIAL, hasDispute: false,
    ownerName: "S. Pardeshi", ownerPhone: "9870667788",
  },

  // --- Project 17: Gosikhurd (3) ---
  {
    projectIndex: 17, district: "Bhandara", surveyNumber: "7/3",
    latitude: 21.1715, longitude: 79.6522, areaHectares: 3.7,
    status: Stage.POSSESSION_TAKEN, enteredStageAt: daysAgo(900),
    awardDate: daysAgo(1100),
    compensationAmount: 4600000, compensationPaid: 4600000,
    compensationStatus: CompensationStatus.PAID,
    hasDispute: true, disputeNotes: "Resettlement colony infrastructure incomplete; affected families' R&R case reopened by local grievance committee.",
    riskLevel: RiskLevel.HIGH,
    riskReason: "Possession taken 900+ days ago; R&R and canal-linked rehabilitation still not finalized — long-stalled case.",
    riskUpdatedAt: daysAgo(5),
  },
  {
    projectIndex: 17, district: "Nagpur", surveyNumber: "12/1B",
    latitude: 21.1598, longitude: 79.6401, areaHectares: 2.9,
    status: Stage.AWARD_DECLARED, enteredStageAt: daysAgo(130),
    awardDate: daysAgo(130),
    compensationAmount: 3300000, compensationPaid: 1650000,
    compensationStatus: CompensationStatus.PARTIAL, hasDispute: false,
  },
  {
    projectIndex: 17, district: "Chandrapur", surveyNumber: "19/4",
    latitude: 20.9412, longitude: 79.4521, areaHectares: 2.2,
    status: Stage.COMPENSATION_DISBURSED, enteredStageAt: daysAgo(250),
    awardDate: daysAgo(330),
    compensationAmount: 2900000, compensationPaid: 2900000,
    compensationStatus: CompensationStatus.PAID, hasDispute: false,
    ownerName: "M. Gedam", ownerPhone: "9881778899",
  },
];

// ===================================================================
// SEED FUNCTION
// ===================================================================

export async function seedProjectsAndLandParcels(prisma: PrismaClient) {
  const projectIds: string[] = []
  const landParcelIds: string[] = []
  const landParcels: Awaited<ReturnType<typeof prisma.landParcel.create>>[] = []

  // Create projects here
  for (const p of projectsSeed) {
    const created = await prisma.project.create({
      data: {
        name: p.name,
        ministry: p.ministry,
        implementingAgency: p.implementingAgency,
        state: p.state,
        sector: p.sector,
        targetCompletion: p.targetCompletion,
      },
    });
    projectIds.push(created.id);
  }

  // Create land parcels here
  for (const parcel of landParcelsSeed) {
    const created = await prisma.landParcel.create({
      data: {
        projectId: projectIds[parcel.projectIndex],
        district: parcel.district,
        surveyNumber: parcel.surveyNumber,
        latitude: parcel.latitude,
        longitude: parcel.longitude,
        areaHectares: parcel.areaHectares,
        status: parcel.status,
        enteredStageAt: parcel.enteredStageAt,
        awardDate: parcel.awardDate,
        compensationAmount: parcel.compensationAmount,
        compensationPaid: parcel.compensationPaid,
        compensationStatus: parcel.compensationStatus,
        hasDispute: parcel.hasDispute,
        disputeNotes: parcel.disputeNotes,
        ownerName: parcel.ownerName,
        ownerPhone: parcel.ownerPhone,
        riskLevel: parcel.riskLevel,
        riskReason: parcel.riskReason,
        riskUpdatedAt: parcel.riskUpdatedAt,
      },
    });
    landParcelIds.push(created.id);
    landParcels.push(created);
  }

  return {
    projectIds,
    landParcelIds,
    landParcels,
  }
}