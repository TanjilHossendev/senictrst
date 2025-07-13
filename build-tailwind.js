const fs = require('fs');
const path = require('path');
const postcss = require('postcss');
const tailwindcss = require('tailwindcss');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');

async function build() {
  try {
    // Read the input CSS
    const css = fs.readFileSync('./src/input.css', 'utf8');
    
    // Process with PostCSS
    const result = await postcss([
      tailwindcss('./tailwind.config.js'),
      autoprefixer,
      cssnano({ preset: 'default' })
    ])
    .process(css, { from: './src/input.css', to: './sub_page/Financial_Calculators/assets/minify_css/output.css' });
    
    // Ensure directory exists
    const outputDir = path.dirname('./sub_page/Financial_Calculators/assets/minify_css/output.css');
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }
    
    // Write the output
    fs.writeFileSync('./sub_page/Financial_Calculators/assets/minify_css/output.css', result.css);
    
    console.log('✅ Tailwind CSS built successfully!');
  } catch (error) {
    console.error('❌ Build failed:', error);
  }
}

build();
