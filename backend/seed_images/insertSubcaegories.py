from gigs.models import Category, SubCategory

subcategories = {
    "Graphic Design": ["Logo Design", "Brand Style Guides", "Business Cards", "Illustration", "Website Design"],
    "Digital Marketing": ["Social Media Marketing", "SEO", "Content Marketing", "Email Marketing", "Marketing Strategy"],
    "Writing & Translation": ["Article Writing", "Translation", "Proofreading", "Creative Writing", "Technical Writing"],
    "Video & Animation": ["Whiteboard Animation", "Video Editing", "Short Video Ads", "Intros & Outros", "Animated GIFs"],
    "Music & Audio": ["Voice Over", "Mixing & Mastering", "Podcast Editing", "Sound Effects", "Singer-Songwriters"],
    "Programming & Tech": ["Web Development", "Mobile Apps", "E-Commerce Development", "Chatbots", "Cybersecurity"],
    "Business": ["Business Plans", "Virtual Assistant", "Data Entry", "Market Research", "Project Management"],
    "Lifestyle": ["Fitness Lessons", "Life Coaching", "Cooking Lessons", "Relationship Advice", "Astrology"],
    "Data": ["Data Analysis", "Data Visualization", "Data Entry", "Machine Learning", "Data Mining"],
    "Photography": ["Photo Editing", "Product Photography", "Real Estate Photography", "Portrait Retouching", "Photo Restoration"]
}

for cat_name, sub_names in subcategories.items():
    category = Category.objects.get(name=cat_name)
    for sub_name in sub_names:
        SubCategory.objects.create(name=sub_name, category=category)
