import shutil
import os

src = r"C:\Users\Iqra bibi\.gemini\antigravity\brain\63c66807-590b-4879-8d60-ec54f6b07a81\nexus_logo_1779186781000.png"
dst_dir = r"d:\hackathon\nexus-agent\frontend\public"

if not os.path.exists(dst_dir):
    os.makedirs(dst_dir)

dst_logo = os.path.join(dst_dir, "logo.png")
dst_fav = os.path.join(dst_dir, "favicon.ico")

try:
    shutil.copy(src, dst_logo)
    shutil.copy(src, dst_fav)
    print("Logo and Favicon copied successfully!")
except Exception as e:
    print(f"Error: {e}")
