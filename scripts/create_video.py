import os
import subprocess
from PIL import Image

FRAME_DIR = "/Users/souvikkundu/Desktop/car/public/video-frames"
OUTPUT_MP4 = "/Users/souvikkundu/Desktop/car/public/drivesense_mobile_walkthrough.mp4"
OUTPUT_WEBP = "/Users/souvikkundu/Desktop/car/public/drivesense_mobile_walkthrough.webp"
ARTIFACT_DIR = "/Users/souvikkundu/.gemini/antigravity-ide/brain/dff6830f-1644-4386-b17c-8641bd0da40b"

screens = [
    "onboarding.png",
    "home.png",
    "quickadd.png",
    "my-car.png",
    "my-car-health.png",
    "my-car-specs.png",
    "inspection.png",
    "assistant.png",
    "expenses.png",
    "drive.png",
    "emergency.png"
]

images = []
target_size = (500, 1050)

for s in screens:
    path = os.path.join(FRAME_DIR, s)
    if os.path.exists(path):
        img = Image.open(path).convert("RGB")
        if img.size != target_size:
            img = img.resize(target_size, Image.Resampling.LANCZOS)
        images.append(img)
    else:
        print(f"Warning: {path} not found")

print(f"Loaded {len(images)} screen images.")

fps = 30
hold_frames = 45  # 1.5 seconds per screen
fade_frames = 15  # 0.5 seconds transition

# Generate MP4
ffmpeg_mp4 = [
    "/opt/homebrew/bin/ffmpeg",
    "-y",
    "-f", "rawvideo",
    "-vcodec", "rawvideo",
    "-s", f"{target_size[0]}x{target_size[1]}",
    "-pix_fmt", "rgb24",
    "-r", str(fps),
    "-i", "-",
    "-c:v", "libx264",
    "-preset", "fast",
    "-crf", "22",
    "-pix_fmt", "yuv420p",
    "-movflags", "+faststart",
    OUTPUT_MP4
]

proc = subprocess.Popen(ffmpeg_mp4, stdin=subprocess.PIPE)

for i in range(len(images)):
    curr_img = images[i]
    next_img = images[(i + 1) % len(images)]
    
    # Hold screen
    curr_bytes = curr_img.tobytes()
    for _ in range(hold_frames):
        proc.stdin.write(curr_bytes)
        
    # Crossfade to next screen
    for f in range(fade_frames):
        alpha = (f + 1) / float(fade_frames)
        blended = Image.blend(curr_img, next_img, alpha)
        proc.stdin.write(blended.tobytes())

proc.stdin.close()
proc.wait()
print(f"MP4 Video created successfully: {OUTPUT_MP4} (Size: {os.path.getsize(OUTPUT_MP4)} bytes)")

# Convert to high-quality animated WebP for markdown embed
scale_size = (360, 756)
ffmpeg_webp = [
    "/opt/homebrew/bin/ffmpeg",
    "-y",
    "-i", OUTPUT_MP4,
    "-vf", f"fps=15,scale={scale_size[0]}:{scale_size[1]}:flags=lanczos",
    "-c:v", "libwebp",
    "-lossless", "0",
    "-q:v", "70",
    "-loop", "0",
    OUTPUT_WEBP
]

subprocess.run(ffmpeg_webp, check=True)
print(f"WebP Video created successfully: {OUTPUT_WEBP} (Size: {os.path.getsize(OUTPUT_WEBP)} bytes)")

# Copy to artifact directory
subprocess.run(["cp", OUTPUT_WEBP, os.path.join(ARTIFACT_DIR, "drivesense_mobile_walkthrough.webp")], check=True)
subprocess.run(["cp", OUTPUT_MP4, os.path.join(ARTIFACT_DIR, "drivesense_mobile_walkthrough.mp4")], check=True)
print("Copied to artifacts directory.")
