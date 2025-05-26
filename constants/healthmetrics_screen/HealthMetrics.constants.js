// app/tabs/health/HealthMetrics.constants.js

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
    { id: 'thyroid', name: 'Thyroid', icon: 'body-outline', color: '#673AB7' }
  ];
  
  // Enhanced full list of metric types with comprehensive information
  export const metricTypes = [
    // Blood related
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
      factors: [
        { title: 'Diet', icon: 'nutrition-outline', description: 'Carbohydrates in food directly affect blood sugar levels.' },
        { title: 'Physical Activity', icon: 'fitness-outline', description: 'Exercise helps muscles use glucose and improves insulin sensitivity.' },
        { title: 'Medications', icon: 'medkit-outline', description: 'Insulin and other medications can lower blood sugar levels.' },
        { title: 'Stress', icon: 'sad-outline', description: 'Hormones released during stress can raise blood sugar levels.' }
      ],
      concerns: [
        { 
          title: 'Hypoglycemia (Low Blood Sugar)', 
          severity: 'high',
          description: 'Can cause confusion, dizziness, sweating, and in severe cases, loss of consciousness. Immediate treatment with fast-acting carbohydrates is needed.' 
        },
        { 
          title: 'Hyperglycemia (High Blood Sugar)', 
          severity: 'high',
          description: 'Persistent high levels can lead to diabetes complications, including nerve damage, kidney disease, and cardiovascular problems.' 
        }
      ],
      resources: [
        { title: 'American Diabetes Association', url: 'https://www.diabetes.org/' },
        { title: 'CDC - Managing Diabetes', url: 'https://www.cdc.gov/diabetes/managing/index.html' }
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
    
    // Heart related metrics
    { 
      id: 'hdl', 
      name: 'HDL Cholesterol', 
      icon: 'heart-outline', 
      color: '#4CAF50', 
      category: 'organs', 
      subcategory: 'heart',
      unit: 'mg/dL',
      description: 'High-density lipoprotein (HDL) cholesterol is known as the "good" cholesterol because it helps remove other forms of cholesterol from your bloodstream.',
      importance: 'Higher levels of HDL cholesterol are associated with a lower risk of heart disease. HDL acts like a scavenger, carrying LDL (bad) cholesterol away from the arteries and back to the liver, where it\'s broken down and passed from the body.',
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
      resources: [
        { title: 'American Heart Association', url: 'https://www.heart.org/' },
        { title: 'Mayo Clinic - HDL Cholesterol', url: 'https://www.mayoclinic.org/diseases-conditions/high-blood-cholesterol/in-depth/hdl-cholesterol/art-20046388' }
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
      description: 'Low-density lipoprotein (LDL) cholesterol is often called the "bad" cholesterol because it collects in the walls of your blood vessels, increasing your risk of health problems.',
      importance: 'LDL cholesterol contributes to fatty buildups in arteries (atherosclerosis), which increases the risk of heart attack, stroke, and peripheral artery disease.',
      ranges: [
        { label: 'Optimal', value: 'Less than 100 mg/dL', color: '#4CAF50' },
        { label: 'Near Optimal', value: '100-129 mg/dL', color: '#8BC34A' },
        { label: 'Borderline High', value: '130-159 mg/dL', color: '#FFC107' },
        { label: 'High', value: '160-189 mg/dL', color: '#FF9800' },
        { label: 'Very High', value: '190 mg/dL and above', color: '#F44336' }
      ],
      factors: [
        { title: 'Diet', icon: 'nutrition-outline', description: 'Foods high in saturated and trans fats can raise LDL levels.' },
        { title: 'Weight', icon: 'body-outline', description: 'Excess weight can increase LDL cholesterol.' },
        { title: 'Physical Activity', icon: 'fitness-outline', description: 'Regular exercise can help lower LDL cholesterol.' },
        { title: 'Genetics', icon: 'people-outline', description: 'Family history can influence your LDL levels.' }
      ],
      concerns: [
        { 
          title: 'Atherosclerosis', 
          severity: 'high',
          description: 'Buildup of plaque in arteries can restrict blood flow and lead to heart attacks or strokes.' 
        },
        { 
          title: 'Coronary Heart Disease', 
          severity: 'high',
          description: 'Reduced blood flow to the heart muscle due to plaque buildup can cause chest pain and heart attacks.' 
        }
      ],
      resources: [
        { title: 'American Heart Association', url: 'https://www.heart.org/' },
        { title: 'NIH - LDL Management', url: 'https://www.nhlbi.nih.gov/health-topics/blood-cholesterol' }
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
      id: 'blood_pressure', 
      name: 'Blood Pressure', 
      icon: 'fitness-outline', 
      color: '#2C7BE5', 
      category: 'organs', 
      subcategory: 'heart',
      unit: 'mmHg'
    },
    
    // Liver related
    { 
      id: 'alt', 
      name: 'ALT', 
      icon: 'medical-outline', 
      color: '#FB8C00', 
      category: 'organs', 
      subcategory: 'liver',
      unit: 'U/L',
      description: 'Alanine Aminotransferase (ALT) is an enzyme primarily found in liver cells. When liver cells are damaged, ALT is released into the bloodstream.',
      importance: 'ALT is a key indicator of liver health. Elevated levels may suggest liver inflammation or damage from various causes, including viral hepatitis, alcohol consumption, or certain medications.',
      ranges: [
        { label: 'Normal (Men)', value: '7-55 U/L', color: '#4CAF50' },
        { label: 'Normal (Women)', value: '7-45 U/L', color: '#4CAF50' },
        { label: 'Elevated', value: 'Above 55 U/L for men, Above 45 U/L for women', color: '#F44336' }
      ],
      factors: [
        { title: 'Alcohol Consumption', icon: 'wine-outline', description: 'Excessive alcohol can damage liver cells and raise ALT levels.' },
        { title: 'Medications', icon: 'medkit-outline', description: 'Some medications can cause liver injury and elevated ALT.' },
        { title: 'Obesity', icon: 'body-outline', description: 'Non-alcoholic fatty liver disease is associated with elevated ALT.' },
        { title: 'Viral Infections', icon: 'bug-outline', description: 'Hepatitis viruses can cause liver inflammation and high ALT.' }
      ],
      concerns: [
        { 
          title: 'Liver Damage', 
          severity: 'high',
          description: 'Persistently elevated ALT may indicate ongoing liver injury that could lead to scarring or impaired function.' 
        },
        { 
          title: 'Medication Effects', 
          severity: 'borderline',
          description: 'Some common medications can temporarily raise ALT levels without causing significant liver damage.' 
        }
      ],
      resources: [
        { title: 'American Liver Foundation', url: 'https://liverfoundation.org/' },
        { title: 'Mayo Clinic - Liver Function Tests', url: 'https://www.mayoclinic.org/tests-procedures/liver-function-tests/about/pac-20394595' }
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
    
    // Kidney related
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
    
    // Thyroid related  
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
    
    // Vitamins
    { 
      id: 'vitamin_d', 
      name: 'Vitamin D', 
      icon: 'sunny-outline', 
      color: '#FFB300', 
      category: 'vitamins', 
      subcategory: null,
      unit: 'ng/mL',
      description: 'Vitamin D is a fat-soluble vitamin that helps your body absorb calcium and phosphorus, essential for building and maintaining strong bones.',
      importance: 'Besides bone health, Vitamin D plays a role in immune function, cell growth, neuromuscular function, and reduction of inflammation. Deficiency is common and linked to various health problems.',
      ranges: [
        { label: 'Deficient', value: 'Less than 20 ng/mL', color: '#F44336' },
        { label: 'Insufficient', value: '20-29 ng/mL', color: '#FFC107' },
        { label: 'Sufficient', value: '30-100 ng/mL', color: '#4CAF50' },
        { label: 'Potential Toxicity', value: 'Greater than 100 ng/mL', color: '#F44336' }
      ],
      factors: [
        { title: 'Sun Exposure', icon: 'sunny-outline', description: 'Your skin produces Vitamin D when exposed to sunlight.' },
        { title: 'Diet', icon: 'nutrition-outline', description: 'Few foods naturally contain Vitamin D; fatty fish, egg yolks, and fortified foods are sources.' },
        { title: 'Supplements', icon: 'medical-outline', description: 'Many people need supplements to maintain adequate levels.' },
        { title: 'Skin Pigmentation', icon: 'color-palette-outline', description: 'Darker skin produces less Vitamin D from sunlight.' }
      ],
      concerns: [
        { 
          title: 'Bone Health Issues', 
          severity: 'high',
          description: 'Deficiency can lead to rickets in children and osteomalacia or osteoporosis in adults.' 
        },
        { 
          title: 'Immune System Effects', 
          severity: 'borderline',
          description: 'Low levels may be associated with increased susceptibility to infections and autoimmune diseases.' 
        }
      ],
      resources: [
        { title: 'NIH - Vitamin D Fact Sheet', url: 'https://ods.od.nih.gov/factsheets/VitaminD-Consumer/' },
        { title: 'Endocrine Society Guidelines', url: 'https://www.endocrine.org/guidelines-and-clinical-practice/clinical-practice-guidelines' }
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
    
    // Blood related
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
      id: 'glucose_fasting', 
      name: 'Fasting Glucose', 
      icon: 'water-outline', 
      color: '#43A047', 
      category: 'blood', 
      subcategory: null,
      unit: 'mg/dL'
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
    
    // Custom measurements
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
  
  // Reference ranges for each metric
  export const referenceRanges = {
    hdl: { min: 40, max: 60, unit: 'mg/dL', warningLow: 35 },
    ldl: { min: 0, max: 100, unit: 'mg/dL', warningHigh: 130, criticalHigh: 160 },
    total_cholesterol: { min: 125, max: 200, unit: 'mg/dL', warningHigh: 240, criticalHigh: 300 },
    triglycerides: { min: 0, max: 150, unit: 'mg/dL', warningHigh: 200, criticalHigh: 500 },
    vitamin_d: { min: 30, max: 100, unit: 'ng/mL', warningLow: 20, criticalLow: 12 },
    vitamin_b12: { min: 200, max: 900, unit: 'pg/mL', warningLow: 300, criticalLow: 200 },
    folate: { min: 2.7, max: 17.0, unit: 'ng/mL', warningLow: 3.0, criticalLow: 2.0 },
    iron: { min: 60, max: 170, unit: 'μg/dL', warningLow: 50, criticalLow: 30 },
    ferritin: { min: 12, max: 300, unit: 'ng/mL', warningLow: 15, criticalLow: 10 },
    hemoglobin: { min: 12.0, max: 17.5, unit: 'g/dL', warningLow: 11.0, criticalLow: 8.0 },
    hematocrit: { min: 36, max: 52, unit: '%', warningLow: 32, criticalLow: 28 },
    glucose_fasting: { min: 70, max: 99, unit: 'mg/dL', warningLow: 65, warningHigh: 130, criticalLow: 55, criticalHigh: 180 },
    hba1c: { min: 4.0, max: 5.6, unit: '%', warningHigh: 6.4, criticalHigh: 10.0 },
    alt: { min: 7, max: 40, unit: 'U/L', warningHigh: 50, criticalHigh: 200 },
    ast: { min: 8, max: 40, unit: 'U/L', warningHigh: 50, criticalHigh: 200 },
    alp: { min: 44, max: 147, unit: 'U/L', warningHigh: 200, criticalHigh: 400 },
    bilirubin: { min: 0.1, max: 1.2, unit: 'mg/dL', warningHigh: 2.0, criticalHigh: 5.0 },
    creatinine: { min: 0.7, max: 1.3, unit: 'mg/dL', warningHigh: 1.5, criticalHigh: 2.0 },
    blood_urea_nitrogen: { min: 7, max: 20, unit: 'mg/dL', warningHigh: 25, criticalHigh: 50 },
    uric_acid: { min: 3.4, max: 7.0, unit: 'mg/dL', warningHigh: 8.0, criticalHigh: 10.0 },
    tsh: { min: 0.4, max: 4.0, unit: 'mIU/L', warningLow: 0.1, warningHigh: 6.0, criticalLow: 0.01, criticalHigh: 10.0 },
    t3: { min: 80, max: 200, unit: 'ng/dL', warningLow: 70, warningHigh: 220 },
    t4: { min: 5.1, max: 14.1, unit: 'μg/dL', warningLow: 4.5, warningHigh: 15.0 },
    blood_pressure: { min: '90/60', max: '120/80', unit: 'mmHg', warningLow: '90/60', warningHigh: '140/90' },
    weight: { min: 50, max: 100, unit: 'kg' }, // These would be personalized
    bmi: { min: 18.5, max: 24.9, unit: 'kg/m²', warningHigh: 29.9, criticalHigh: 40.0 },
  };