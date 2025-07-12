from PIL import Image

# Load the original image
img = Image.open('images/NCS.png')

# Create and save 192x192 icon
img_192 = img.resize((192, 192), Image.LANCZOS)
img_192.save('images/icon-192x192.png', format='PNG')

# Create and save 512x512 icon
img_512 = img.resize((512, 512), Image.LANCZOS)
img_512.save('images/icon-512x512.png', format='PNG')

print('Icons generated successfully!') 