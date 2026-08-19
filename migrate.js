const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'stitch_kanso_interior_design_systems');
const previewDir = path.join(__dirname, 'app', '(preview)');
const publicAssetsDir = path.join(__dirname, 'public', 'assets');

if (!fs.existsSync(previewDir)) fs.mkdirSync(previewDir, { recursive: true });
if (!fs.existsSync(publicAssetsDir)) fs.mkdirSync(publicAssetsDir, { recursive: true });

function convertHtmlToJsx(html, screenName) {
  // Extract body content
  const bodyMatch = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
  let bodyContent = bodyMatch ? bodyMatch[1] : html;

  // Basic JSX conversions
  bodyContent = bodyContent.replace(/class=/g, 'className=');
  bodyContent = bodyContent.replace(/for=/g, 'htmlFor=');
  bodyContent = bodyContent.replace(/<!--([\s\S]*?)-->/g, '{/*$1*/}');

  // Convert inline styles to objects (basic approach for background-image)
  bodyContent = bodyContent.replace(/style="([^"]+)"/g, (match, styleString) => {
    // Simple inline style to object converter for common cases
    const styleObj = styleString.split(';').filter(s => s.trim()).reduce((acc, style) => {
      const [key, value] = style.split(':').map(s => s.trim());
      if (key && value) {
        const camelKey = key.replace(/-([a-z])/g, g => g[1].toUpperCase());
        acc.push(`${camelKey}: "${value.replace(/"/g, "'")}"`);
      }
      return acc;
    }, []);
    return `style={{ ${styleObj.join(', ')} }}`;
  });

  // Self closing tags
  const voidElements = ['img', 'input', 'br', 'hr', 'link', 'meta', 'source'];
  voidElements.forEach(tag => {
    const regex = new RegExp(`<${tag}\\b([^>]*?)(?<!/)>`, 'gi');
    bodyContent = bodyContent.replace(regex, `<${tag}$1 />`);
  });

  // Fix SVG paths if they have stroke-width etc, though React handles some of these, 
  // it's safer to camelCase them if possible. (Skipping for now as it's complex, React 19 handles data-* and many others better)
  bodyContent = bodyContent.replace(/stroke-width=/g, 'strokeWidth=');
  bodyContent = bodyContent.replace(/stroke-linecap=/g, 'strokeLinecap=');
  bodyContent = bodyContent.replace(/stroke-linejoin=/g, 'strokeLinejoin=');
  bodyContent = bodyContent.replace(/fill-rule=/g, 'fillRule=');
  bodyContent = bodyContent.replace(/clip-rule=/g, 'clipRule=');
  bodyContent = bodyContent.replace(/clip-path=/g, 'clipPath=');

  return bodyContent;
}

const screens = [];

const items = fs.readdirSync(srcDir);
for (const item of items) {
  const itemPath = path.join(srcDir, item);
  if (fs.statSync(itemPath).isDirectory()) {
    const codePath = path.join(itemPath, 'code.html');
    if (fs.existsSync(codePath)) {
      console.log(`Processing ${item}...`);
      const html = fs.readFileSync(codePath, 'utf8');
      
      const jsx = convertHtmlToJsx(html, item);
      
      // Create Next.js route
      const routeDir = path.join(previewDir, item);
      if (!fs.existsSync(routeDir)) fs.mkdirSync(routeDir, { recursive: true });
      
      const pageContent = `
export default function ${item.replace(/[-_]/g, '')}Page() {
  return (
    <>
      ${jsx}
    </>
  );
}
`;
      fs.writeFileSync(path.join(routeDir, 'page.tsx'), pageContent.trim());
      
      // Copy screen.png or other assets if needed
      const screenAssetsDir = path.join(publicAssetsDir, item);
      if (!fs.existsSync(screenAssetsDir)) fs.mkdirSync(screenAssetsDir, { recursive: true });
      
      const files = fs.readdirSync(itemPath);
      for (const file of files) {
        if (file.match(/\.(png|jpg|jpeg|svg|gif)$/i)) {
          fs.copyFileSync(path.join(itemPath, file), path.join(screenAssetsDir, file));
        }
      }
      
      screens.push({
        name: item,
        title: item.replace(/[-_]/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
        path: `/${item}`
      });
    }
  }
}

// Generate Index Page
const indexContent = `
import Link from 'next/link';

export default function GalleryPage() {
  const screens = ${JSON.stringify(screens, null, 2)};
  
  return (
    <div className="min-h-screen bg-surface p-8 lg:p-16">
      <div className="max-w-container-max-app mx-auto">
        <header className="mb-12">
          <h1 className="font-headline-lg text-primary text-4xl mb-4">Screen Gallery</h1>
          <p className="font-body-md text-secondary">Click on any card to preview the Next.js ported screen.</p>
        </header>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {screens.map(screen => (
            <Link key={screen.path} href={screen.path} className="group block">
              <div className="border border-outline-variant rounded-xl overflow-hidden bg-surface-container-lowest shadow-sm transition-transform duration-300 group-hover:scale-[1.02]">
                <div className="aspect-video bg-surface-variant flex items-center justify-center relative overflow-hidden">
                  <img src={\`/assets/\${screen.name}/screen.png\`} alt={screen.title} className="w-full h-full object-cover" onError={(e) => e.currentTarget.style.display = 'none'} />
                </div>
                <div className="p-4">
                  <h2 className="font-label-sm text-primary">{screen.title}</h2>
                  <p className="font-body-md text-secondary text-sm truncate">{screen.path}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
`;
fs.writeFileSync(path.join(__dirname, 'app', 'page.tsx'), indexContent.trim());

console.log("Migration complete!");
