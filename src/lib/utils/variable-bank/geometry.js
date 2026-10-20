// ----------------------------------------------------------------------------
export const SHAPES_POOL = ["circle", "triangle", "square", "rectangle", "half circle", "quarter circle"];
export const COLORS_POOL = ["red", "blue", "yellow", "green", "purple", "orange"];
export const SIZES_POOL = ["small", "medium", "large"];
export const GEOMETRY_SUBJECTS_POOL = [
  "steam train", "space rocket", "friendly robot", "sailboat on water",
  "tall castle", "butterfly", "racecar", "snowman", "house with a tree",
  "dog", "cat", "fish in a bowl", "submarine", "hot air balloon", "bulldozer"
];

export const getRandomShapes = (count = 1) => {
  const shuffled = [...SHAPES_POOL].sort(() => 0.5 - Math.random());
  return count === 1 ? makeCompatibleArray(shuffled[0]) : shuffled.slice(0, count);
};

export const getRandomColors = (count = 1) => {
  const shuffled = [...COLORS_POOL].sort(() => 0.5 - Math.random());
  return count === 1 ? makeCompatibleArray(shuffled[0]) : shuffled.slice(0, count);
};

export const getRandomGeometrySubjects = (count = 1) => {
  const shuffled = [...GEOMETRY_SUBJECTS_POOL].sort(() => 0.5 - Math.random());
  return count === 1 ? makeCompatibleArray(shuffled[0]) : shuffled.slice(0, count);
};

export const getSizesPool = () => [...SIZES_POOL];


export const getRandom3DObject = () => {
  const objects = [
    // --- CONES (20) ---
    { name: 'party hat', shape: 'cone', imageId: 'party_hat' },
    { name: 'ice cream cone', shape: 'cone', imageId: 'ice_cream_cone' },
    { name: 'traffic cone', shape: 'cone', imageId: 'traffic_cone' },
    { name: 'wizard hat', shape: 'cone', imageId: 'wizard_hat' },
    { name: 'funnel', shape: 'cone', imageId: 'funnel' },
    { name: 'pencil tip', shape: 'cone', imageId: 'pencil_tip' },
    { name: 'spinning top', shape: 'cone', imageId: 'spinning_top' },
    { name: 'clown hat', shape: 'cone', imageId: 'clown_hat' },
    { name: 'castle roof', shape: 'cone', imageId: 'castle_roof' },
    { name: 'teepee tent', shape: 'cone', imageId: 'teepee_tent' },
    { name: 'megaphone', shape: 'cone', imageId: 'megaphone' },
    { name: 'piping bag', shape: 'cone', imageId: 'piping_bag' },
    { name: 'snow cone', shape: 'cone', imageId: 'snow_cone' },
    { name: 'carrot', shape: 'cone', imageId: 'carrot' },
    { name: 'badminton shuttlecock', shape: 'cone', imageId: 'badminton_shuttlecock' },
    { name: 'volcano', shape: 'cone', imageId: 'volcano' },
    { name: 'rocket', shape: 'cone', imageId: 'rocket' },
    { name: 'lamp shade', shape: 'cone', imageId: 'lamp_shade' },
    { name: 'fang', shape: 'cone', imageId: 'fang' },
    { name: 'martini glass', shape: 'cone', imageId: 'martini_glass' },
    { name: 'seashell', shape: 'cone', imageId: 'seashell' },

    // --- CUBOIDS (20) ---
    { name: 'tissue box', shape: 'cuboid', imageId: 'tissue_box' },
    { name: 'shoe box', shape: 'cuboid', imageId: 'shoe_box' },
    { name: 'cereal box', shape: 'cuboid', imageId: 'cereal_box' },
    { name: 'brick', shape: 'cuboid', imageId: 'brick' },
    { name: 'packet drink', shape: 'cuboid', imageId: 'packet_drink' },
    { name: 'eraser', shape: 'cuboid', imageId: 'eraser' },
    { name: 'thick book', shape: 'cuboid', imageId: 'thick_book' },
    { name: 'mattress', shape: 'cuboid', imageId: 'mattress' },
    { name: 'refrigerator', shape: 'cuboid', imageId: 'refrigerator' },
    { name: 'microwave oven', shape: 'cuboid', imageId: 'microwave_oven' },
    { name: 'smartphone', shape: 'cuboid', imageId: 'smartphone' },
    { name: 'pencil case', shape: 'cuboid', imageId: 'pencil_case' },
    { name: 'matchbox', shape: 'cuboid', imageId: 'matchbox' },
    { name: 'ruler', shape: 'cuboid', imageId: 'ruler' },
    { name: 'suitcase', shape: 'cuboid', imageId: 'suitcase' },
    { name: 'door', shape: 'cuboid', imageId: 'door' },
    { name: 'cabinet', shape: 'cuboid', imageId: 'cabinet' },
    { name: 'fish tank', shape: 'cuboid', imageId: 'fish_tank' },
    { name: 'lunchbox', shape: 'cuboid', imageId: 'lunchbox' },
    { name: 'television', shape: 'cuboid', imageId: 'television' },

    // --- SPHERES (20) ---
    { name: 'marble', shape: 'sphere', imageId: 'marble' },
    { name: 'basketball', shape: 'sphere', imageId: 'basketball' },
    { name: 'globe', shape: 'sphere', imageId: 'globe' },
    { name: 'tennis ball', shape: 'sphere', imageId: 'tennis_ball' },
    { name: 'football', shape: 'sphere', imageId: 'football' },
    { name: 'ping pong ball', shape: 'sphere', imageId: 'ping_pong_ball' },
    { name: 'bowling ball', shape: 'sphere', imageId: 'bowling_ball' },
    { name: 'orange', shape: 'sphere', imageId: 'orange' },
    { name: 'watermelon', shape: 'sphere', imageId: 'watermelon' },
    { name: 'full moon', shape: 'sphere', imageId: 'full_moon' },
    { name: 'pearl', shape: 'sphere', imageId: 'pearl' },
    { name: 'soap bubble', shape: 'sphere', imageId: 'soap_bubble' },
    { name: 'bead', shape: 'sphere', imageId: 'bead' },
    { name: 'ornament', shape: 'sphere', imageId: 'ornament' },
    { name: 'lollipop top', shape: 'sphere', imageId: 'lollipop_top' },
    { name: 'yarn ball', shape: 'sphere', imageId: 'yarn_ball' },
    { name: 'chocolate ball', shape: 'sphere', imageId: 'chocolate_ball' },
    { name: 'snow globe', shape: 'sphere', imageId: 'snow_globe' },
    { name: 'cannonball', shape: 'sphere', imageId: 'cannonball' },
    { name: 'golf ball', shape: 'sphere', imageId: 'golf_ball' },

    // --- CUBES (20) ---
    { name: 'dice', shape: 'cube', imageId: 'dice' },
    { name: "Rubik's cube", shape: 'cube', imageId: 'rubiks_cube' },
    { name: 'sugar', shape: 'cube', imageId: 'sugar' },
    { name: 'ice', shape: 'cube', imageId: 'ice' },
    { name: 'alphabet block', shape: 'cube', imageId: 'alphabet_block' },
    { name: 'present box', shape: 'cube', imageId: 'present_box' },
    { name: 'building block', shape: 'cube', imageId: 'building_block' },
    { name: 'tissue box', shape: 'cube', imageId: 'square_tissue_box' },
    { name: 'storage box', shape: 'cube', imageId: 'storage_box' },
    { name: 'footstool', shape: 'cube', imageId: 'footstool' },
    { name: 'wooden crate', shape: 'cube', imageId: 'wooden_crate' },
    { name: 'safe', shape: 'cube', imageId: 'safe' },
    { name: 'speaker', shape: 'cube', imageId: 'speaker' },
    { name: 'candy', shape: 'cube', imageId: 'candy' },
    { name: 'cardboard box', shape: 'cube', imageId: 'cardboard_box' },
    { name: 'cheese', shape: 'cube', imageId: 'cheese' },
    { name: 'pot', shape: 'cube', imageId: 'pot' },
    { name: 'basket', shape: 'cube', imageId: 'basket' },
    { name: 'tofu', shape: 'cube', imageId: 'tofu' },
    { name: 'radio', shape: 'cube', imageId: 'radio' },

    // --- CYLINDERS (20) ---
    { name: 'can of soup', shape: 'cylinder', imageId: 'can_of_soup' },
    { name: 'drinking glass', shape: 'cylinder', imageId: 'drinking_glass' },
    { name: 'battery', shape: 'cylinder', imageId: 'battery' },
    { name: 'toilet paper roll', shape: 'cylinder', imageId: 'toilet_paper_roll' },
    { name: 'water bottle', shape: 'cylinder', imageId: 'water_bottle' },
    { name: 'drinking straw', shape: 'cylinder', imageId: 'drinking_straw' },
    { name: 'lipstick', shape: 'cylinder', imageId: 'lipstick' },
    { name: 'marker pen', shape: 'cylinder', imageId: 'marker_pen' },
    { name: 'rolling pin', shape: 'cylinder', imageId: 'rolling_pin' },
    { name: 'pipe', shape: 'cylinder', imageId: 'pipe' },
    { name: 'drum', shape: 'cylinder', imageId: 'drum' },
    { name: 'candle', shape: 'cylinder', imageId: 'candle' },
    { name: 'coin', shape: 'cylinder', imageId: 'coin' },
    { name: 'fire extinguisher', shape: 'cylinder', imageId: 'fire_extinguisher' },
    { name: 'test tube', shape: 'cylinder', imageId: 'test_tube' },
    { name: 'puck', shape: 'cylinder', imageId: 'puck' },
    { name: 'spool of thread', shape: 'cylinder', imageId: 'spool_of_thread' },
    { name: 'wooden log', shape: 'cylinder', imageId: 'wooden_log' },
    { name: 'chalk', shape: 'cylinder', imageId: 'chalk' },
    { name: 'pillar', shape: 'cylinder', imageId: 'pillar' },
  ];
  return objects[Math.floor(Math.random() * objects.length)];
};

