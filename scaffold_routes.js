const fs = require('fs');
const path = require('path');

const baseAppDir = path.join(__dirname, 'apps', 'web', 'app');
const previewDir = path.join(baseAppDir, '(preview)');

const routeMap = [
  { route: 'login', src: 'login_kanso' },
  { route: 'signup', src: 'sign_up_kanso' },
  { route: 'dashboard', src: 'my_spaces_kanso' },
  { route: 'project/new/room-type', src: 'select_room_type_kanso' },
  { route: 'project/new/capture', src: 'capture_your_space_kanso' },
  { route: 'project/new/style', src: 'choose_your_style_kanso' },
  { route: 'project/new/review', src: 'review_project_kanso' },
  { route: 'project/[id]/generating', src: 'generating_concepts_kanso' },
  { route: 'project/[id]/results', src: 'kanso_premium_ai_interior_design' },
  { route: 'project/[id]/selected', src: 'your_new_space_kanso' },
  { route: 'project/[id]/consultation', src: 'book_a_specialist_kanso' },
  { route: 'project/[id]/matching', src: 'matching_specialist_kanso' },
  { route: 'project/[id]/success', src: 'booking_confirmed_kanso' },
  { route: 'pro/dashboard', src: 'partner_dashboard_kanso_pro' },
  { route: 'pro/leads/[id]', src: 'lead_details_kanso_pro' },
  { route: 'pro/profile', src: 'specialist_profile_kanso' },
  { route: 'pro/schedule', src: 'my_schedule_kanso_pro' },
  { route: 'admin', src: 'admin_onboarding_kanso_pro' }
];

routeMap.forEach(({ route, src }) => {
  const targetDir = path.join(baseAppDir, ...route.split('/'));
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }
  
  const srcPage = path.join(previewDir, src, 'page.tsx');
  const targetPage = path.join(targetDir, 'page.tsx');
  
  if (fs.existsSync(srcPage)) {
    // Copy the UI from the preview folder over to the real route
    let content = fs.readFileSync(srcPage, 'utf8');
    // Ensure use client is present if needed, though most are just UI
    if (!content.includes('"use client"') && !content.includes("'use client'")) {
       content = '"use client";\n\n' + content;
    }
    fs.writeFileSync(targetPage, content);
    console.log(`Scaffolded /${route} from ${src}`);
  } else {
    // Fallback if missing
    fs.writeFileSync(targetPage, `"use client";\n\nexport default function Page() { return <div>Placeholder for ${route}</div>; }`);
    console.log(`Created placeholder for /${route}`);
  }
});

console.log("Scaffolding complete.");
