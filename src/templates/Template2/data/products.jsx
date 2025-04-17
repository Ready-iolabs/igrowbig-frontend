export const categories = [
  { id: 'beauty', name: 'Beauty', image: '/images/beauty.png' },
  { id: 'cardiac', name: 'Cardiac Health', image: '/images/car.png' },
  { id: 'child', name: 'Child Development & Growth', image: '/images/child.png' },
  { id: 'home', name: 'Cozy Home', image: '/images/home.png' },
  { id: 'detox', name: 'Detox', image: '/images/detox.png' },
  { id: 'digestive', name: 'Digestive & Intestinal Health', image: '/images/diges.png' },
  { id: 'elderly', name: 'Elderly Health', image: '/images/elder.png' },
  { id: 'energy', name: 'Energy & Active', image: '/images/energy.png' },
  { id: 'immunity', name: 'Immunity', image: '/images/immunity.png' }, // Fixed typo
  { id: 'men', name: "Men's Wellness", image: '/images/man.png' },
  { id: 'weight', name: 'Weight Management', image: '/images/health.png' },
  { id: 'women', name: "Women's Wellness", image: '/images/woman.png' },
];

export const products = [
  // Beauty
  {
    id: 'skincare-serum',
    name: 'Anti-Aging Skincare Serum',
    category: 'beauty',
    image: 'https://images.unsplash.com/photo-1620912189868-2151650adb3f?q=80&w=2070&auto=format&fit=crop', // Serum bottle
    description: 'A luxurious serum to reduce wrinkles and promote youthful skin.',
  },
  {
    id: 'moisturizer',
    name: 'Hydrating Moisturizer',
    category: 'beauty',
    image: 'https://images.unsplash.com/photo-1556227709-4a977e9f0f44?q=80&w=2070&auto=format&fit=crop', // Moisturizer cream
    description: 'Locks in moisture for a radiant, healthy glow all day.',
  },

  // Cardiac Health
  {
    id: 'omega3',
    name: 'Omega-3 Essential Fatty Acids',
    category: 'cardiac',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2070&auto=format&fit=crop', // Fish oil supplements
    description: 'Support your heart health with our scientifically formulated Omega-3 supplement.',
  },
  {
    id: 'purus',
    name: 'Purus',
    category: 'cardiac',
    image: 'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?q=80&w=2070&auto=format&fit=crop', // Heart health pills
    description: 'A powerful supplement for cardiovascular wellness.',
  },
  {
    id: 'lavie',
    name: 'LaVie',
    category: 'cardiac',
    image: 'https://images.unsplash.com/photo-1600577916048-7d7b8fc9220e?q=80&w=2070&auto=format&fit=crop', // Heart-themed supplement
    description: 'Enhance your heart health with LaVie’s unique blend.',
  },

  // Child Development & Growth
  {
    id: 'kids-vitamins',
    name: 'Kids Multi-Vitamins',
    category: 'child',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2070&auto=format&fit=crop', // Colorful vitamins
    description: 'Essential nutrients to support growing kids.',
  },
  {
    id: 'growth-milk',
    name: 'Growth Support Milk',
    category: 'child',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2070&auto=format&fit=crop', // Milk bottle
    description: 'A tasty drink packed with calcium and vitamins for strong bones.',
  },

  // Cozy Home
  {
    id: 'air-purifier',
    name: 'Air Purifier Blend',
    category: 'home',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2070&auto=format&fit=crop', // Air purifier device
    description: 'Cleanse your home’s air with natural essential oils.',
  },
  {
    id: 'cozy-diffuser',
    name: 'Aroma Diffuser',
    category: 'home',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2070&auto=format&fit=crop', // Diffuser with mist
    description: 'Create a relaxing atmosphere with this stylish diffuser.',
  },

  // Detox
  {
    id: 'detox-tea',
    name: 'Detox Herbal Tea',
    category: 'detox',
    image: 'https://images.unsplash.com/photo-1545205597-3d9c9895585e?q=80&w=2070&auto=format&fit=crop', // Herbal tea
    description: 'Flush out toxins with this soothing herbal blend.',
  },
  {
    id: 'cleanse-caps',
    name: 'Cleanse Capsules',
    category: 'detox',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2070&auto=format&fit=crop', // Detox pills
    description: 'A daily supplement to support natural detoxification.',
  },

  // Digestive & Intestinal Health
  {
    id: 'probiotics',
    name: 'Probiotic Blend',
    category: 'digestive',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2070&auto=format&fit=crop', // Probiotic capsules
    description: 'Promote gut health with beneficial bacteria.',
  },
  {
    id: 'fiber-plus',
    name: 'Fiber Plus',
    category: 'digestive',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2070&auto=format&fit=crop', // Fiber supplement
    description: 'Boost digestion with this high-fiber supplement.',
  },

  // Elderly Health
  {
    id: 'joint-support',
    name: 'Joint Support Formula',
    category: 'elderly',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2070&auto=format&fit=crop', // Joint health pills
    description: 'Ease joint stiffness and improve mobility for seniors.',
  },
  {
    id: 'senior-vitamins',
    name: 'Senior Multivitamins',
    category: 'elderly',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2070&auto=format&fit=crop', // Senior supplements
    description: 'Tailored nutrients for the needs of older adults.',
  },

  // Energy & Active
  {
    id: 'energy-drink',
    name: 'Energy Boost Drink',
    category: 'energy',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2070&auto=format&fit=crop', // Energy drink bottle
    description: 'A refreshing drink to keep you active all day.',
  },
  {
    id: 'pre-workout',
    name: 'Pre-Workout Powder',
    category: 'energy',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2070&auto=format&fit=crop', // Pre-workout powder
    description: 'Fuel your workouts with this powerful mix.',
  },

  // Immunity
  {
    id: 'immune-shield',
    name: 'Immune Shield',
    category: 'immunity',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2070&auto=format&fit=crop', // Immunity supplement
    description: 'Strengthen your immune system with antioxidants.',
  },
  {
    id: 'vitamin-c',
    name: 'Vitamin C Boost',
    category: 'immunity',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2070&auto=format&fit=crop', // Vitamin C tablets
    description: 'High-potency Vitamin C for daily immune support.',
  },

  // Men's Wellness
  {
    id: 'mens-vitality',
    name: 'Men’s Vitality Complex',
    category: 'men',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2070&auto=format&fit=crop', // Men’s health supplement
    description: 'Support stamina and overall men’s health.',
  },
  {
    id: 'prostate-care',
    name: 'Prostate Care',
    category: 'men',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2070&auto=format&fit=crop', // Prostate supplement
    description: 'Promote prostate health with natural ingredients.',
  },

  // Weight Management
  {
    id: 'slim-shake',
    name: 'Slim Shake',
    category: 'weight',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2070&auto=format&fit=crop', // Protein shake
    description: 'A meal replacement shake to support weight loss.',
  },
  {
    id: 'fat-burner',
    name: 'Fat Burner Capsules',
    category: 'weight',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2070&auto=format&fit=crop', // Fat burner pills
    description: 'Boost metabolism and burn fat naturally.',
  },

  // Women's Wellness
  {
    id: 'womens-multivitamin',
    name: 'Women’s Multivitamin',
    category: 'women',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2070&auto=format&fit=crop', // Women’s vitamins
    description: 'Essential nutrients tailored for women’s health.',
  },
  {
    id: 'hormone-balance',
    name: 'Hormone Balance',
    category: 'women',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2070&auto=format&fit=crop', // Hormone supplement
    description: 'Support hormonal harmony with this gentle formula.',
  },
];