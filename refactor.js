const fs = require('fs');
const path = require('path');

const htmlDir = path.join(__dirname, 'HTML');
const files = fs.readdirSync(htmlDir).filter(f => f.endsWith('.html'));

const svgFavicon = `
    <!-- ===== FAVICON ===== -->
    <link rel="icon" type="image/svg+xml" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Cpath fill='%23D4AF37' d='M50 10 L10 40 L90 40 Z M20 40 L20 80 L35 80 L35 40 M45 40 L45 80 L55 80 L55 40 M65 40 L65 80 L80 80 L80 40 M10 80 L90 80 L90 90 L10 90 Z'/%3E%3C/svg%3E" />
    <link rel="apple-touch-icon" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Cpath fill='%23D4AF37' d='M50 10 L10 40 L90 40 Z M20 40 L20 80 L35 80 L35 40 M45 40 L45 80 L55 80 L55 40 M65 40 L65 80 L80 80 L80 40 M10 80 L90 80 L90 90 L10 90 Z'/%3E%3C/svg%3E" />
`;

const scriptsToInject = `
    <!-- COMPONENTS -->
    <script src="../JS/components/header.js"></script>
    <script src="../JS/components/footer.js"></script>
    <script src="../JS/layout.js"></script>
`;

for (const file of files) {
    const filePath = path.join(htmlDir, file);
    let content = fs.readFileSync(filePath, 'utf8');

    // Replace Favicon
    content = content.replace(/<!-- ===== FAVICON ===== -->[\s\S]*?(?=<!-- ===== GOOGLE FONTS ===== -->|<link)/, svgFavicon.trim() + '\n    ');

    // Replace <header class="main-header">...</header> with <div id="layout-header"></div>
    content = content.replace(/<header\b[^>]*>[\s\S]*?<\/header>/gi, '<div id="layout-header"></div>');

    // Replace <footer class="main-footer">...</footer> with <div id="layout-footer"></div>
    content = content.replace(/<footer\b[^>]*>[\s\S]*?<\/footer>/gi, '<div id="layout-footer"></div>');

    // Inject scripts before <!--OUR JAVASCRIPT --> or </body>
    if (content.includes('<!--OUR JAVASCRIPT -->')) {
        content = content.replace('<!--OUR JAVASCRIPT -->', scriptsToInject.trim() + '\n\n    <!--OUR JAVASCRIPT -->');
    } else if (content.includes('</body>')) {
        content = content.replace('</body>', scriptsToInject.trim() + '\n  </body>');
    }

    // Write back
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Processed ${file}`);
}
