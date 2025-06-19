from gigs.models import Category
from django.core.files import File
import os

data = [
    { "name": "Graphic Design", "image": "seed_images/service-1.svg", "description": "From images to full branding, discover creative design services tailored to your visual needs." },
    { "name": "Digital Marketing", "image": "seed_images/service-2.svg", "description": "Boost your online presence with expert SEO, social media, and advertising strategies." },
    { "name": "Writing & Translation", "image": "seed_images/service-3.svg", "description": "Get professional writing, editing, and translation in any language or tone." },
    { "name": "Video & Animation", "image": "seed_images/service-4.svg", "description": "Engaging video content, animations, intros, and more to bring your ideas to life." },
    { "name": "Music & Audio", "image": "seed_images/service-5.svg", "description": "Explore voiceovers, custom music, sound design, and audio editing from talented creators." },
    { "name": "Programming & Tech", "image": "seed_images/service-6.svg", "description": "Web development, mobile apps, APIs, and technical support by top-tier developers." },
    { "name": "Business", "image": "seed_images/service-7.svg", "description": "Find services for business plans, consulting, virtual assistance, and more." },
    { "name": "Lifestyle", "image": "seed_images/service-8.svg", "description": "Wellness, fitness, fashion, astrology, and unique lifestyle services all in one place." },
    { "name": "Data", "image": "seed_images/service-9.svg", "description": "Data analysis, visualization, machine learning, and everything data-driven." },
    { "name": "Photography", "image": "seed_images/service-10.svg", "description": "Photo editing, retouching, and virtual shoots from skilled photographers." }
]

for item in data:
    with open(item['image'], 'rb') as f:
        filename = os.path.basename(item['image'])
        image_file = File(f, name=filename)
        Category.objects.create(
            name=item['name'],
            description=item['description'],
            image=image_file
        )
