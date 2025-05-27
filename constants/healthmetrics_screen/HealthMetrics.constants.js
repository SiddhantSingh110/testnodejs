// constants/healthmetrics_screen/HealthMetrics.constants.js

// Categories for metrics
export const categories = [
  { id: 'all', name: 'All', icon: 'apps-outline' },
  { id: 'blood', name: 'Blood', icon: 'water-outline' },
  { id: 'organs', name: 'Organs', icon: 'fitness-outline' },
  { id: 'vitamins', name: 'Vitamins', icon: 'leaf-outline' },
  { id: 'custom', name: 'Custom', icon: 'add-circle-outline' },
];

// Subcategories for organs
export const organCategories = [
  { id: 'heart', name: 'Heart', icon: 'heart-outline', color: '#E53935' },
  { id: 'liver', name: 'Liver', icon: 'medical-outline', color: '#FB8C00' },
  { id: 'kidney', name: 'Kidney', icon: 'water-outline', color: '#43A047' },
  { id: 'thyroid', name: 'Thyroid', icon: 'body-outline', color: '#673AB7' },
  { id: 'endocrine', name: 'Endocrine', icon: 'pulse-outline', color: '#9C27B0' }
];

// ✨ COMPREHENSIVE METRIC TYPES - Updated to match backend mappings
export const metricTypes = [
  // ============ HEART/CARDIOVASCULAR ============
  { 
    id: 'hdl', 
    name: 'HDL Cholesterol', 
    icon: 'heart-outline', 
    color: '#4CAF50', 
    category: 'organs', 
    subcategory: 'heart',
    unit: 'mg/dL',
    description: 'High-density lipoprotein (HDL) cholesterol is known as the "good" cholesterol because it helps remove other forms of cholesterol from your bloodstream.',
    importance: 'Higher levels of HDL cholesterol are associated with a lower risk of heart disease. HDL acts like a scavenger, carrying LDL (bad) cholesterol away from the arteries and back to the liver.',
    ranges: [
      { label: 'Low (Risk Factor)', value: 'Less than 40 mg/dL for men, Less than 50 mg/dL for women', color: '#F44336' },
      { label: 'Average', value: '40-59 mg/dL', color: '#FFC107' },
      { label: 'Optimal (Protective)', value: '60 mg/dL and above', color: '#4CAF50' }
    ],
    factors: [
      { title: 'Physical Activity', icon: 'fitness-outline', description: 'Regular exercise can raise HDL levels significantly.' },
      { title: 'Diet', icon: 'nutrition-outline', description: 'Healthy fats like those in olive oil, nuts, and fatty fish can boost HDL.' },
      { title: 'Smoking', icon: 'flame-outline', description: 'Quitting smoking can help increase HDL levels.' },
      { title: 'Weight', icon: 'body-outline', description: 'Losing excess weight can increase HDL levels.' }
    ],
    concerns: [
      { 
        title: 'Increased Cardiovascular Risk', 
        severity: 'high',
        description: 'Low HDL levels are associated with an increased risk of heart disease and stroke.' 
      }
    ],
    percentileData: {
      value: 58,
      percentile: 78,
      target: 85
    },
    recommendations: [
      {
        title: 'Heart-Healthy Fats',
        icon: 'nutrition-outline',
        description: 'Include sources of healthy fats in your diet to boost HDL levels.',
        steps: [
          'Add olive oil, avocados, and nuts to your diet',
          'Eat fatty fish like salmon twice a week',
          'Limit saturated and trans fats',
          'Consider using plant sterols/stanols'
        ]
      },
      {
        title: 'Regular Aerobic Exercise',
        icon: 'fitness-outline',
        description: 'Consistent aerobic activity can significantly raise HDL levels.',
        steps: [
          'Aim for 30 minutes of moderate activity most days',
          'Include activities like brisk walking, swimming or cycling',
          'Gradually increase intensity over time',
          'Be consistent - regular exercise has cumulative benefits'
        ]
      }
    ]
  },
  { 
    id: 'ldl', 
    name: 'LDL Cholesterol', 
    icon: 'heart-outline', 
    color: '#FF5722', 
    category: 'organs', 
    subcategory: 'heart',
    unit: 'mg/dL',
    description: 'Low-density lipoprotein (LDL) cholesterol is often called the "bad" cholesterol because it collects in the walls of your blood vessels.',
    importance: 'LDL cholesterol contributes to fatty buildups in arteries (atherosclerosis), which increases the risk of heart attack, stroke, and peripheral artery disease.',
    ranges: [
      { label: 'Optimal', value: 'Less than 100 mg/dL', color: '#4CAF50' },
      { label: 'Near Optimal', value: '100-129 mg/dL', color: '#8BC34A' },
      { label: 'Borderline High', value: '130-159 mg/dL', color: '#FFC107' },
      { label: 'High', value: '160-189 mg/dL', color: '#FF9800' },
      { label: 'Very High', value: '190 mg/dL and above', color: '#F44336' }
    ]
  },
  { 
    id: 'total_cholesterol', 
    name: 'Total Cholesterol', 
    icon: 'heart-outline', 
    color: '#FF9800', 
    category: 'organs', 
    subcategory: 'heart',
    unit: 'mg/dL'
  },
  { 
    id: 'triglycerides', 
    name: 'Triglycerides', 
    icon: 'heart-outline', 
    color: '#9C27B0', 
    category: 'organs', 
    subcategory: 'heart',
    unit: 'mg/dL'
  },
  { 
    id: 'vldl', 
    name: 'VLDL Cholesterol', 
    icon: 'heart-outline', 
    color: '#795548', 
    category: 'organs', 
    subcategory: 'heart',
    unit: 'mg/dL'
  },
  { 
    id: 'non_hdl_cholesterol', 
    name: 'Non-HDL Cholesterol', 
    icon: 'heart-outline', 
    color: '#607D8B', 
    category: 'organs', 
    subcategory: 'heart',
    unit: 'mg/dL'
  },
  { 
    id: 'blood_pressure', 
    name: 'Blood Pressure', 
    icon: 'fitness-outline', 
    color: '#2C7BE5', 
    category: 'organs', 
    subcategory: 'heart',
    unit: 'mmHg'
  },
  { 
    id: 'troponin', 
    name: 'Troponin', 
    icon: 'heart-outline', 
    color: '#F44336', 
    category: 'organs', 
    subcategory: 'heart',
    unit: 'ng/mL'
  },
  { 
    id: 'ck_mb', 
    name: 'CK-MB', 
    icon: 'heart-outline', 
    color: '#E91E63', 
    category: 'organs', 
    subcategory: 'heart',
    unit: 'ng/mL'
  },
  { 
    id: 'bnp', 
    name: 'BNP', 
    icon: 'heart-outline', 
    color: '#9C27B0', 
    category: 'organs', 
    subcategory: 'heart',
    unit: 'pg/mL'
  },

  // ============ LIVER FUNCTION ============
  { 
    id: 'alt', 
    name: 'ALT', 
    icon: 'medical-outline', 
    color: '#FB8C00', 
    category: 'organs', 
    subcategory: 'liver',
    unit: 'U/L',
    description: 'Alanine Aminotransferase (ALT) is an enzyme primarily found in liver cells. When liver cells are damaged, ALT is released into the bloodstream.',
    importance: 'ALT is a key indicator of liver health. Elevated levels may suggest liver inflammation or damage from various causes.',
    ranges: [
      { label: 'Normal (Men)', value: '7-55 U/L', color: '#4CAF50' },
      { label: 'Normal (Women)', value: '7-45 U/L', color: '#4CAF50' },
      { label: 'Elevated', value: 'Above 55 U/L for men, Above 45 U/L for women', color: '#F44336' }
    ],
    factors: [
      { title: 'Alcohol Consumption', icon: 'wine-outline', description: 'Excessive alcohol can damage liver cells and raise ALT levels.' },
      { title: 'Medications', icon: 'medkit-outline', description: 'Some medications can cause liver injury and elevated ALT.' },
      { title: 'Obesity', icon: 'body-outline', description: 'Non-alcoholic fatty liver disease is associated with elevated ALT.' }
    ]
  },
  { 
    id: 'ast', 
    name: 'AST', 
    icon: 'medical-outline', 
    color: '#FB8C00', 
    category: 'organs', 
    subcategory: 'liver',
    unit: 'U/L'
  },
  { 
    id: 'alp', 
    name: 'ALP', 
    icon: 'medical-outline', 
    color: '#FB8C00', 
    category: 'organs', 
    subcategory: 'liver',
    unit: 'U/L'
  },
  { 
    id: 'bilirubin', 
    name: 'Bilirubin', 
    icon: 'medical-outline', 
    color: '#FB8C00', 
    category: 'organs', 
    subcategory: 'liver',
    unit: 'mg/dL'
  },

  // ============ KIDNEY FUNCTION ============
  { 
    id: 'creatinine', 
    name: 'Creatinine', 
    icon: 'water-outline', 
    color: '#43A047', 
    category: 'organs', 
    subcategory: 'kidney',
    unit: 'mg/dL'
  },
  { 
    id: 'blood_urea_nitrogen', 
    name: 'Blood Urea Nitrogen', 
    icon: 'water-outline', 
    color: '#43A047', 
    category: 'organs', 
    subcategory: 'kidney',
    unit: 'mg/dL'
  },
  { 
    id: 'uric_acid', 
    name: 'Uric Acid', 
    icon: 'water-outline', 
    color: '#43A047', 
    category: 'organs', 
    subcategory: 'kidney',
    unit: 'mg/dL'
  },
  { 
    id: 'egfr', 
    name: 'eGFR', 
    icon: 'water-outline', 
    color: '#43A047', 
    category: 'organs', 
    subcategory: 'kidney',
    unit: 'mL/min/1.73m²'
  },

  // ============ THYROID FUNCTION ============  
  { 
    id: 'tsh', 
    name: 'TSH', 
    icon: 'body-outline', 
    color: '#673AB7', 
    category: 'organs', 
    subcategory: 'thyroid',
    unit: 'mIU/L'
  },
  { 
    id: 't3', 
    name: 'T3', 
    icon: 'body-outline', 
    color: '#673AB7', 
    category: 'organs', 
    subcategory: 'thyroid',
    unit: 'ng/dL'
  },
  { 
    id: 't4', 
    name: 'T4', 
    icon: 'body-outline', 
    color: '#673AB7', 
    category: 'organs', 
    subcategory: 'thyroid',
    unit: 'μg/dL'
  },
  { 
    id: 'free_t3', 
    name: 'Free T3', 
    icon: 'body-outline', 
    color: '#673AB7', 
    category: 'organs', 
    subcategory: 'thyroid',
    unit: 'pg/mL'
  },
  { 
    id: 'free_t4', 
    name: 'Free T4', 
    icon: 'body-outline', 
    color: '#673AB7', 
    category: 'organs', 
    subcategory: 'thyroid',
    unit: 'ng/dL'
  },

  // ============ ENDOCRINE SYSTEM ============
  { 
    id: 'insulin', 
    name: 'Insulin', 
    icon: 'pulse-outline', 
    color: '#9C27B0', 
    category: 'organs', 
    subcategory: 'endocrine',
    unit: 'μIU/mL'
  },
  { 
    id: 'cortisol', 
    name: 'Cortisol', 
    icon: 'pulse-outline', 
    color: '#9C27B0', 
    category: 'organs', 
    subcategory: 'endocrine',
    unit: 'μg/dL'
  },
  { 
    id: 'testosterone', 
    name: 'Testosterone', 
    icon: 'pulse-outline', 
    color: '#9C27B0', 
    category: 'organs', 
    subcategory: 'endocrine',
    unit: 'ng/dL'
  },
  { 
    id: 'estrogen', 
    name: 'Estrogen', 
    icon: 'pulse-outline', 
    color: '#9C27B0', 
    category: 'organs', 
    subcategory: 'endocrine',
    unit: 'pg/mL'
  },

  // ============ VITAMINS AND MINERALS ============
  { 
    id: 'vitamin_d', 
    name: 'Vitamin D', 
    icon: 'sunny-outline', 
    color: '#FFB300', 
    category: 'vitamins', 
    subcategory: null,
    unit: 'ng/mL',
    description: 'Vitamin D is a fat-soluble vitamin that helps your body absorb calcium and phosphorus, essential for building and maintaining strong bones.',
    importance: 'Besides bone health, Vitamin D plays a role in immune function, cell growth, neuromuscular function, and reduction of inflammation.',
    ranges: [
      { label: 'Deficient', value: 'Less than 20 ng/mL', color: '#F44336' },
      { label: 'Insufficient', value: '20-29 ng/mL', color: '#FFC107' },
      { label: 'Sufficient', value: '30-100 ng/mL', color: '#4CAF50' },
      { label: 'Potential Toxicity', value: 'Greater than 100 ng/mL', color: '#F44336' }
    ],
    factors: [
      { title: 'Sun Exposure', icon: 'sunny-outline', description: 'Your skin produces Vitamin D when exposed to sunlight.' },
      { title: 'Diet', icon: 'nutrition-outline', description: 'Few foods naturally contain Vitamin D; fatty fish, egg yolks, and fortified foods are sources.' },
      { title: 'Supplements', icon: 'medical-outline', description: 'Many people need supplements to maintain adequate levels.' }
    ],
    percentileData: {
      value: 28,
      percentile: 35,
      target: 60
    },
    recommendations: [
      {
        title: 'Sun Exposure',
        icon: 'sunny-outline',
        description: 'Safe sun exposure is a natural way to boost vitamin D levels.',
        steps: [
          'Aim for 10-30 minutes of midday sun exposure several times weekly',
          'Expose face, arms, legs, or back without sunscreen',
          'Darker skin may need longer exposure times',
          'Be careful not to burn'
        ]
      },
      {
        title: 'Dietary Sources',
        icon: 'nutrition-outline',
        description: 'Include vitamin D-rich foods in your diet regularly.',
        steps: [
          'Eat fatty fish like salmon, mackerel, and tuna twice weekly',
          'Choose vitamin D-fortified foods like milk, orange juice, and cereals',
          'Include egg yolks and mushrooms in your diet',
          'Consider a vitamin D supplement if levels remain low'
        ]
      }
    ]
  },
  { 
    id: 'vitamin_b12', 
    name: 'Vitamin B12', 
    icon: 'leaf-outline', 
    color: '#8BC34A', 
    category: 'vitamins', 
    subcategory: null,
    unit: 'pg/mL'
  },
  { 
    id: 'vitamin_b6', 
    name: 'Vitamin B6', 
    icon: 'leaf-outline', 
    color: '#8BC34A', 
    category: 'vitamins', 
    subcategory: null,
    unit: 'ng/mL'
  },
  { 
    id: 'folate', 
    name: 'Folate', 
    icon: 'leaf-outline', 
    color: '#4CAF50', 
    category: 'vitamins', 
    subcategory: null,
    unit: 'ng/mL'
  },
  { 
    id: 'iron', 
    name: 'Iron', 
    icon: 'leaf-outline', 
    color: '#795548', 
    category: 'vitamins', 
    subcategory: null,
    unit: 'μg/dL'
  },
  { 
    id: 'ferritin', 
    name: 'Ferritin', 
    icon: 'leaf-outline', 
    color: '#795548', 
    category: 'vitamins', 
    subcategory: null,
    unit: 'ng/mL'
  },
  { 
    id: 'tibc', 
    name: 'TIBC', 
    icon: 'leaf-outline', 
    color: '#795548', 
    category: 'vitamins', 
    subcategory: null,
    unit: 'μg/dL'
  },

  // ============ BLOOD TESTS ============
  { 
    id: 'hemoglobin', 
    name: 'Hemoglobin', 
    icon: 'water-outline', 
    color: '#9C27B0', 
    category: 'blood', 
    subcategory: null,
    unit: 'g/dL'
  },
  { 
    id: 'hematocrit', 
    name: 'Hematocrit', 
    icon: 'water-outline', 
    color: '#9C27B0', 
    category: 'blood', 
    subcategory: null,
    unit: '%'
  },
  { 
    id: 'rbc_count', 
    name: 'RBC Count', 
    icon: 'water-outline', 
    color: '#9C27B0', 
    category: 'blood', 
    subcategory: null,
    unit: 'million/µL'
  },
  { 
    id: 'wbc_count', 
    name: 'WBC Count', 
    icon: 'water-outline', 
    color: '#2196F3', 
    category: 'blood', 
    subcategory: null,
    unit: 'thousand/µL'
  },
  { 
    id: 'platelet_count', 
    name: 'Platelet Count', 
    icon: 'water-outline', 
    color: '#FF9800', 
    category: 'blood', 
    subcategory: null,
    unit: 'thousand/µL'
  },
  { 
    id: 'glucose_fasting', 
    name: 'Fasting Glucose', 
    icon: 'water-outline', 
    color: '#43A047', 
    category: 'blood', 
    subcategory: null,
    unit: 'mg/dL'
  },
  { 
    id: 'blood_sugar', 
    name: 'Blood Sugar', 
    icon: 'water-outline', 
    color: '#43A047', 
    category: 'blood', 
    subcategory: null,
    unit: 'mg/dL',
    description: 'Blood sugar or blood glucose is the amount of glucose in your bloodstream. Glucose is your body\'s main source of energy.',
    importance: 'Monitoring blood sugar is essential, particularly for people with diabetes or prediabetes, as persistent high levels can damage organs and blood vessels.',
    ranges: [
      { label: 'Low', value: 'Below 70 mg/dL', color: '#F44336' },
      { label: 'Normal (fasting)', value: '70-99 mg/dL', color: '#4CAF50' },
      { label: 'Prediabetes (fasting)', value: '100-125 mg/dL', color: '#FFC107' },
      { label: 'Diabetes (fasting)', value: '126 mg/dL or higher', color: '#F44336' }
    ],
    percentileData: {
      value: 85,
      percentile: 70,
      target: 75
    },
    recommendations: [
      {
        title: 'Balanced Diet',
        icon: 'nutrition-outline',
        description: 'Focus on a diet rich in vegetables, lean proteins, and complex carbohydrates to maintain stable blood sugar levels.',
        steps: [
          'Choose foods with a low glycemic index',
          'Eat regular, balanced meals',
          'Limit processed foods and added sugars',
          'Include fiber-rich foods in your diet'
        ]
      },
      {
        title: 'Regular Exercise',
        icon: 'fitness-outline',
        description: 'Physical activity helps your body use insulin more efficiently and can help maintain healthy blood sugar levels.',
        steps: [
          'Aim for 150 minutes of moderate activity weekly',
          'Include both aerobic exercises and strength training',
          'Check your blood sugar before and after exercise',
          'Stay hydrated during workouts'
        ]
      }
    ]
  },
  { 
    id: 'hba1c', 
    name: 'HbA1c', 
    icon: 'water-outline', 
    color: '#43A047', 
    category: 'blood', 
    subcategory: null,
    unit: '%'
  },
  { 
    id: 'sodium', 
    name: 'Sodium', 
    icon: 'water-outline', 
    color: '#2196F3', 
    category: 'blood', 
    subcategory: null,
    unit: 'mEq/L'
  },
  { 
    id: 'potassium', 
    name: 'Potassium', 
    icon: 'water-outline', 
    color: '#FF9800', 
    category: 'blood', 
    subcategory: null,
    unit: 'mEq/L'
  },
  { 
    id: 'chloride', 
    name: 'Chloride', 
    icon: 'water-outline', 
    color: '#607D8B', 
    category: 'blood', 
    subcategory: null,
    unit: 'mEq/L'
  },
  
  // ============ CUSTOM MEASUREMENTS ============
  { 
    id: 'weight', 
    name: 'Weight', 
    icon: 'scale-outline', 
    color: '#795548', 
    category: 'custom', 
    subcategory: null,
    unit: 'kg'
  },
  { 
    id: 'bmi', 
    name: 'BMI', 
    icon: 'body-outline', 
    color: '#607D8B', 
    category: 'custom', 
    subcategory: null,
    unit: 'kg/m²'
  }
];

// ✨ COMPREHENSIVE REFERENCE RANGES - Updated to match backend
export const referenceRanges = {
  // Cholesterol Panel
  hdl: { min: 40, max: 60, unit: 'mg/dL', warningLow: 35 },
  ldl: { min: 0, max: 100, unit: 'mg/dL', warningHigh: 130, criticalHigh: 160 },
  total_cholesterol: { min: 125, max: 200, unit: 'mg/dL', warningHigh: 240, criticalHigh: 300 },
  triglycerides: { min: 0, max: 150, unit: 'mg/dL', warningHigh: 200, criticalHigh: 500 },
  vldl: { min: 5, max: 40, unit: 'mg/dL', warningHigh: 50, criticalHigh: 100 },
  non_hdl_cholesterol: { min: 30, max: 130, unit: 'mg/dL', warningHigh: 160, criticalHigh: 190 },

  // Thyroid
  tsh: { min: 0.4, max: 4.0, unit: 'mIU/L', warningLow: 0.1, warningHigh: 6.0, criticalLow: 0.01, criticalHigh: 10.0 },
  t3: { min: 80, max: 200, unit: 'ng/dL', warningLow: 70, warningHigh: 220 },
  t4: { min: 5.1, max: 14.1, unit: 'μg/dL', warningLow: 4.5, warningHigh: 15.0 },
  free_t3: { min: 2.0, max: 4.4, unit: 'pg/mL', warningLow: 1.8, warningHigh: 5.0 },
  free_t4: { min: 0.82, max: 1.77, unit: 'ng/dL', warningLow: 0.7, warningHigh: 2.0 },

  // Vitamins
  vitamin_d: { min: 30, max: 100, unit: 'ng/mL', warningLow: 20, criticalLow: 12 },
  vitamin_b12: { min: 200, max: 900, unit: 'pg/mL', warningLow: 300, criticalLow: 200 },
  vitamin_b6: { min: 5, max: 50, unit: 'ng/mL', warningLow: 3, criticalLow: 2 },
  folate: { min: 2.7, max: 17.0, unit: 'ng/mL', warningLow: 3.0, criticalLow: 2.0 },
  iron: { min: 60, max: 170, unit: 'μg/dL', warningLow: 50, criticalLow: 30 },
  ferritin: { min: 12, max: 300, unit: 'ng/mL', warningLow: 15, criticalLow: 10 },
  tibc: { min: 250, max: 400, unit: 'μg/dL', warningHigh: 450, criticalHigh: 500 },

  // Blood Count
  hemoglobin: { min: 12.0, max: 17.5, unit: 'g/dL', warningLow: 11.0, criticalLow: 8.0 },
  hematocrit: { min: 36, max: 52, unit: '%', warningLow: 32, criticalLow: 28 },
  rbc_count: { min: 4.5, max: 5.5, unit: 'million/µL', warningLow: 4.0, criticalLow: 3.5 },
  wbc_count: { min: 4.5, max: 11.0, unit: 'thousand/µL', warningLow: 4.0, criticalLow: 2.0 },
  platelet_count: { min: 150, max: 450, unit: 'thousand/µL', warningLow: 100, criticalLow: 50 },

  // Glucose/Diabetes
  glucose_fasting: { min: 70, max: 99, unit: 'mg/dL', warningLow: 65, warningHigh: 130, criticalLow: 55, criticalHigh: 180 },
  blood_sugar: { min: 70, max: 99, unit: 'mg/dL', warningLow: 65, warningHigh: 130, criticalLow: 55, criticalHigh: 180 },
  hba1c: { min: 4.0, max: 5.6, unit: '%', warningHigh: 6.4, criticalHigh: 10.0 },

  // Liver Function
  alt: { min: 7, max: 40, unit: 'U/L', warningHigh: 50, criticalHigh: 200 },
  ast: { min: 8, max: 40, unit: 'U/L', warningHigh: 50, criticalHigh: 200 },
  alp: { min: 44, max: 147, unit: 'U/L', warningHigh: 200, criticalHigh: 400 },
  bilirubin: { min: 0.1, max: 1.2, unit: 'mg/dL', warningHigh: 2.0, criticalHigh: 5.0 },

  // Kidney Function
  creatinine: { min: 0.7, max: 1.3, unit: 'mg/dL', warningHigh: 1.5, criticalHigh: 2.0 },
  blood_urea_nitrogen: { min: 7, max: 20, unit: 'mg/dL', warningHigh: 25, criticalHigh: 50 },
  uric_acid: { min: 3.4, max: 7.0, unit: 'mg/dL', warningHigh: 8.0, criticalHigh: 10.0 },
  egfr: { min: 90, max: 120, unit: 'mL/min/1.73m²', warningLow: 60, criticalLow: 30 },

  // Electrolytes
  sodium: { min: 136, max: 145, unit: 'mEq/L', warningLow: 135, warningHigh: 146, criticalLow: 130, criticalHigh: 150 },
  potassium: { min: 3.5, max: 5.0, unit: 'mEq/L', warningLow: 3.3, warningHigh: 5.2, criticalLow: 3.0, criticalHigh: 6.0 },
  chloride: { min: 98, max: 107, unit: 'mEq/L', warningLow: 96, warningHigh: 109, criticalLow: 90, criticalHigh: 115 },

  // Cardiac Markers
  troponin: { min: 0, max: 0.04, unit: 'ng/mL', warningHigh: 0.1, criticalHigh: 2.0 },
  ck_mb: { min: 0, max: 3.0, unit: 'ng/mL', warningHigh: 5.0, criticalHigh: 10.0 },
  bnp: { min: 0, max: 100, unit: 'pg/mL', warningHigh: 300, criticalHigh: 900 },

  // Hormones
  testosterone: { min: 300, max: 1000, unit: 'ng/dL', warningLow: 250, criticalLow: 150 },
  estrogen: { min: 15, max: 350, unit: 'pg/mL', warningLow: 10, warningHigh: 400 },
  cortisol: { min: 6.2, max: 19.4, unit: 'μg/dL', warningLow: 5.0, warningHigh: 23.0, criticalLow: 3.0, criticalHigh: 30.0 },
  insulin: { min: 2.6, max: 24.9, unit: 'μIU/mL', warningHigh: 30.0, criticalHigh: 50.0 },

  // Blood Pressure
  blood_pressure: { min: '90/60', max: '120/80', unit: 'mmHg', warningLow: '90/60', warningHigh: '140/90' },

  // Physical Measurements
  weight: { min: 40, max: 150, unit: 'kg' }, // Highly variable
  bmi: { min: 18.5, max: 24.9, unit: 'kg/m²', warningHigh: 29.9, criticalHigh: 40.0 },
};