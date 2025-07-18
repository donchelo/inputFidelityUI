// Contenido de la ayuda para prompts de moda con alta fidelidad. Puedes editar este texto libremente.

const promptHelpContent = `

## Estructura Base para Prompts de Moda
**Formato:** "[Acción] the [prenda] to [cambio] while preserving [elementos críticos]. Maintain [calidad específica]."

## Elementos Críticos a Preservar SIEMPRE:
- Proporción corporal y pose exacta
- Tono de piel y características faciales
- Textura y caída de otras prendas
- Iluminación y sombras naturales
- Logos y elementos de marca existentes

## 1. REEMPLAZO DE PRENDAS SUPERIORES

### Camisetas/Blusas:
\`"Replace the current top with a [color] [garment type] while maintaining the exact body pose, skin tone, and facial features. Preserve the fit and drape naturally on the existing body shape."\`

**Ejemplos:**
- \`"Replace the white t-shirt with a black silk blouse while preserving the model's pose, facial features, and skin tone. Maintain natural fabric drape and professional lighting."\`
- \`"Change the sweater to a red crop top while keeping the exact arm position, facial expression, and hair styling. Ensure the new garment fits naturally."\`

### Blazers/Chaquetas:
\`"Transform the [current jacket] into a [new jacket] while maintaining all facial details, hair texture, and body proportions. Preserve natural lighting and shadow patterns."\`

## 2. REEMPLAZO DE PRENDAS INFERIORES

### Pantalones/Faldas:
\`"Replace the [current bottom] with [new garment] while preserving the upper body positioning, facial features, and any visible accessories. Maintain natural leg proportions."\`

**Ejemplos:**
- \`"Replace the jeans with a black pencil skirt while maintaining the exact upper body pose, facial features, and shoe choice. Ensure professional tailoring."\`
- \`"Change the dress to high-waisted trousers and a crop top while preserving the model's face, hair, and arm positioning."\`

## 3. MODIFICACIÓN DE VESTIDOS

\`"Transform the current dress into a [new style] while maintaining the model's exact facial features, hair styling, and body proportions. Preserve the natural pose and expression."\`

**Ejemplos:**
- \`"Change the casual sundress to an elegant evening gown while preserving the model's face, hair texture, and natural standing pose."\`
- \`"Transform the maxi dress into a mini cocktail dress while keeping all facial details, hair styling, and arm positioning unchanged."\`

## 4. ACCESORIOS

### Agregar:
\`"Add [accessory] to the outfit while preserving all existing clothing, facial features, and body positioning. Ensure natural integration with current style."\`

### Ejemplos:
- \`"Add a statement pearl necklace while maintaining the exact neckline, facial features, and hair positioning. Ensure natural jewelry placement."\`
- \`"Include a designer handbag in the model's hand while preserving arm position, facial expression, and all clothing details."\`

### Reemplazar:
\`"Replace the current [accessory] with [new accessory] while maintaining all clothing details, facial features, and body positioning."\`

## 5. MODIFICACIÓN DE CALZADO

\`"Replace the current footwear with [new shoes] while preserving the leg positioning, stance, and all upper body details. Maintain natural foot positioning."\`

**Ejemplos:**
- \`"Change the sneakers to black high heels while maintaining the exact leg position, clothing fit, and all facial details."\`
- \`"Replace the boots with strappy sandals while preserving the ankle positioning, dress hemline, and model's confident stance."\`

## 6. LOGOS Y BRANDING

### Agregar Logos:
\`"Add the [brand] logo to the [garment location] while maintaining the exact fabric texture, garment fit, and all model details. Ensure natural logo integration."\`

### Ejemplos:
- \`"Add the Nike swoosh to the upper left chest of the t-shirt while preserving the exact fabric drape, model's pose, and facial features."\`
- \`"Integrate the Chanel logo onto the handbag while keeping all clothing details, hand positioning, and facial expression unchanged."\`

### Reemplazar Logos:
\`"Replace the current brand logo with [new brand] while maintaining the exact garment style, model positioning, and all other clothing details."\`

## 7. CAMBIOS DE COLOR Y ESTAMPADOS

### Colores:
\`"Change the [garment] color from [current] to [new color] while preserving the exact fabric texture, garment fit, and all model details."\`

### Ejemplos:
- \`"Transform the blue jeans to black while maintaining the exact denim texture, fit, and all upper body details. Preserve natural fabric aging."\`
- \`"Change the white shirt to burgundy while keeping the exact collar style, fabric drape, and model's pose."\`

### Estampados:
\`"Add [pattern] to the [garment] while maintaining the exact garment shape, model positioning, and fabric drape. Ensure pattern flows naturally."\`

## 8. MODIFICACIÓN DE FIT

\`"Modify the [garment] to have a [new fit style] while preserving the model's exact body proportions, facial features, and positioning. Maintain natural fabric behavior."\`

**Ejemplos:**
- \`"Change the oversized blazer to a fitted tailored cut while maintaining the model's pose, facial details, and arm positioning."\`
- \`"Transform the loose t-shirt to a fitted crop top while keeping the exact facial features, hair styling, and lower body positioning."\`

## CAMBIOS COMPLEJOS

### Outfit Completo:
\`"Transform the entire outfit to [new style] while maintaining the model's exact facial features, hair texture, body proportions, and confident pose. Preserve skin tone accuracy."\`

### Cambio de Temporada:
\`"Adapt the current outfit for [season] while maintaining the model's exact appearance, pose, and styling. Replace garments appropriately for weather."\`

## PALABRAS CLAVE PARA CALIDAD

**Textiles:** "fabric authenticity," "natural drape," "textile accuracy"
**Cuero:** "leather grain detail," "natural patina," "luxury material quality"
**Denim:** "denim weave texture," "natural fade patterns," "authentic indigo depth"
**Seda:** "silk luster," "natural flow," "premium fabric behavior"

## ❌ ERRORES COMUNES A EVITAR

1. **Prompts vagos:** "Change the clothes" → ❌
2. **Ignorar coherencia:** "Add ballgown top to jeans" → ❌
3. **Olvidar preservación facial:** No mencionar "facial features" → ❌
4. **Múltiples cambios simultáneos:** Demasiados cambios en un prompt → ❌

## ✅ MEJORES PRÁCTICAS

1. **Siempre menciona:** "while preserving facial features, skin tone, and pose"
2. **Especifica texturas:** "maintain denim texture," "preserve silk drape"
3. **Un cambio por prompt:** Enfócate en una modificación principal
4. **Usa referencias de calidad:** "professional lighting," "commercial photography quality"
5. **Testa gradualmente:** Empieza con cambios simples antes de transformaciones complejas

## VERIFICACIÓN DE CALIDAD

Para probar efectividad:
\`"Create a subtle color variation of the current top (red to burgundy) while maintaining all other details to test preservation quality."\`

**Recuerda:** La clave es el equilibrio entre el cambio deseado y la preservación de elementos que mantienen la autenticidad y calidad profesional de la imagen.
`;

export default promptHelpContent;