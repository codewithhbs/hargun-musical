const mongoose = require('mongoose');
const slugify = require('slugify');
const Product = require('./models/Product.model'); // path check kar lena
const dotenv = require('dotenv');
dotenv.config();

const dbURI = process.env.MONGO_DB_URL;

mongoose.connect(dbURI).then(async () => {
    console.log("DB Connected");

    const products = await Product.find();

    for (let product of products) {
        if (!product.slug) {
            let baseSlug = slugify(product.product_name, {
                lower: true,
                strict: true
            });

            let slug = baseSlug;
            let count = 1;

            // 🔥 unique slug logic
            while (await Product.findOne({ slug })) {
                slug = `${baseSlug}-${count}`;
                count++;
            }

            product.slug = slug;
            await product.save();

            console.log(`Updated: ${product.product_name} → ${product.slug}`);
        }
    }

    console.log("✅ All product slugs updated");
    process.exit();
}).catch(err => {
    console.error("DB Error:", err);
});