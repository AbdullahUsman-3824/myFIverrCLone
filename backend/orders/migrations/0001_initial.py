# Generated by Django 5.2 on 2025-05-14 05:33

import django.db.models.deletion
import django.utils.timezone
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('gigs', '0002_gig_gigfaq_giggallery_gigpackage_savedgig'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Order',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('description', models.TextField()),
                ('total_amount', models.DecimalField(decimal_places=2, max_digits=10)),
                ('status', models.CharField(choices=[('placed', 'Placed'), ('accepted', 'Accepted'), ('in_progress', 'In Progress'), ('completed', 'Completed'), ('cancelled', 'Cancelled')], default='placed', max_length=15)),
                ('created_at', models.DateTimeField(default=django.utils.timezone.now)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('buyer', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='orders_made', to=settings.AUTH_USER_MODEL)),
                ('gig', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='orders', to='gigs.gig')),
                ('package', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='gigs.gigpackage')),
                ('seller', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='orders_received', to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='OrderAttachment',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('file_path', models.CharField(max_length=255)),
                ('order', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='attachments', to='orders.order')),
            ],
        ),
        migrations.CreateModel(
            name='OrderCancellation',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('reason', models.TextField()),
                ('is_dispute', models.BooleanField(default=False)),
                ('order', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='cancellations', to='orders.order')),
            ],
        ),
        migrations.CreateModel(
            name='OrderMilestone',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('title', models.CharField(max_length=100)),
                ('description', models.TextField()),
                ('created_at', models.DateTimeField(default=django.utils.timezone.now)),
                ('order', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='milestones', to='orders.order')),
            ],
        ),
    ]
