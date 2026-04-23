import sys
from PIL import Image

if len(sys.argv) < 3:
    print("Usage: make_trans.py <input> <output>")
    sys.exit(1)

# Open the image and convert to RGBA
img = Image.open(sys.argv[1]).convert("RGBA")
datas = img.getdata()

bg_color = datas[0]
threshold = 30 # tolerance

newData = []
for item in datas:
    if abs(item[0]-bg_color[0]) < threshold and abs(item[1]-bg_color[1]) < threshold and abs(item[2]-bg_color[2]) < threshold:
        newData.append((255, 255, 255, 0))
    else:
        newData.append(item)

img.putdata(newData)

bbox = img.getbbox()
if bbox:
    img = img.crop(bbox)

img.save(sys.argv[2], "PNG")
print(f"Saved {sys.argv[2]}")
