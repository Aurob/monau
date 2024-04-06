from PIL import Image
import os

photos_base = '/var/www/website/files/photos'
thumb_path = '/var/www/website/files/photos/thumbnails'

def create_thumbnail(image_path, dest_path, thumb_size):
    """Creates a thumbnail of an image with the given size.
    """
    img = Image.open(image_path)
    img.thumbnail(thumb_size)
    img.save(dest_path)

def create_thumbnails(thumb_size):
    """Creates thumbnails for all images in the given directory.
    """
    for photodir in os.listdir(photos_base):
        if photodir == 'thumbnails':
            continue
        
        for photo in os.listdir(os.path.join(photos_base, photodir)):
            if photo.endswith('.jpg'):
                # first check if a thumbnail already exists
                path = os.path.join(thumb_path, photodir, photo)
                if not os.path.exists(path):
                    print(path)
                    # create a thumbnail for the image

                    try:
                        create_thumbnail(os.path.join(photos_base, photodir, photo), path, thumb_size)
                    except IOError:
                        print('cannot create thumbnail for', path)
                        
if __name__ == '__main__':
    thumb_size = (128, 128)
    create_thumbnails(thumb_size)