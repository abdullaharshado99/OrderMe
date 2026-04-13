import segno
import hashlib
from PIL import Image, ImageDraw, ImageFont
from pathlib import Path
from datetime import datetime


class RestaurantQRManager:
    def __init__(self, base_url="https://yourdomain.com/scan"):
        self.base_url = base_url
        self.logo = Image.open("sevva.png").convert("RGBA")

    def generate_secure_qr(self, restaurant_name, restaurant_id, table_id, output_dir):

        token = hashlib.md5(
            f"{restaurant_id}{table_id}{datetime.now().timestamp()}".encode()
        ).hexdigest()[:10]

        qr_url = f"{self.base_url}?r={restaurant_id}&t={table_id}&tk={token}"

        # QR data
        qr_data = {
            "restaurant_name": f"Restaurant_{restaurant_name}",
            "restaurant_id": restaurant_id,
            "table_id": table_id,
            "table_number": table_id,
            "token": token
        }

        # Step 1: Generate QR (temporary)
        temp_qr_path = f"{output_dir}/temp_qr.png"
        qr = segno.make(qr_url, error="H")

        qr.save(
            temp_qr_path,
            scale=10,
            dark="#4A148C",
            light="#F3E5F5"
        )

        qr_img = Image.open(temp_qr_path).convert("RGBA")

        # Step 2: Resize logo
        logo_size = 120
        logo = self.logo.resize((logo_size, logo_size))

        # Step 3: Create text
        text = f"Table {table_id}"

        # Font (default fallback)
        try:
            font = ImageFont.truetype("arial.ttf", 40)
        except:
            font = ImageFont.load_default()

        # Calculate text size
        dummy_img = Image.new("RGB", (1, 1))
        draw = ImageDraw.Draw(dummy_img)
        text_width, text_height = draw.textbbox((0, 0), text, font=font)[2:]

        # Step 4: Create final canvas
        width = max(qr_img.width, logo_size + 40)
        height = logo_size + text_height + qr_img.height + 60

        final_img = Image.new("RGBA", (width, height), "white")

        draw = ImageDraw.Draw(final_img)

        # Step 5: Paste logo (TOP)
        logo_x = (width - logo_size) // 2
        final_img.paste(logo, (logo_x, 10), logo)

        # Step 6: Draw text (MIDDLE)
        text_x = (width - text_width) // 2
        text_y = logo_size + 20
        draw.text((text_x, text_y), text, fill="black", font=font)

        # Step 7: Paste QR (BOTTOM)
        qr_x = (width - qr_img.width) // 2
        qr_y = logo_size + text_height + 40
        final_img.paste(qr_img, (qr_x, qr_y))

        # Step 8: Save final image
        filename = f"{output_dir}/qr_r{restaurant_id}_t{table_id}.png"
        final_img.save(filename)

        return {
            "filename": filename,
            "url": qr_url,
            "restaurant_id": restaurant_id,
            "table_id": table_id,
            "token": token
        }

    def generate_all_tables_qr(self, restaurant_name, restaurant_id, num_tables, output_dir):
        Path(output_dir).mkdir(exist_ok=True)

        qr_list = []
        for table_id in range(1, num_tables + 1):
            qr_info = self.generate_secure_qr(
                restaurant_name,
                restaurant_id,
                table_id,
                output_dir
            )
            qr_list.append(qr_info)
            print(f"Table {table_id}: {qr_info['filename']}")

        return qr_list


qr_manager = RestaurantQRManager()
qr_codes = qr_manager.generate_all_tables_qr(
    restaurant_name="Sevva",
    restaurant_id=102,
    num_tables=5,
    output_dir="qr_codes"
)