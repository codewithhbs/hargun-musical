const mongoose = require('mongoose');
const slugify = require('slugify');

const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    position: {
        type: Number,
        default: 0
    },
    SubCategory: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'SubCategory'
    }],
    NumberOfProducts: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product'
    }],
    slug: {
        type: String,
        unique: true
    }
}, {
    timestamps: true
});


// 🔥 Auto slug generate
// categorySchema.pre('save', function(next) {
//     if (this.isModified('name')) {
//         this.slug = slugify(this.name, {
//             lower: true,
//             strict: true
//         });
//     }
//     next();
// });

categorySchema.pre('save', async function(next) {
    if (this.isModified('name')) {
        let baseSlug = slugify(this.name, { lower: true, strict: true });
        let slug = baseSlug;
        let count = 1;

        while (await mongoose.models.Category.findOne({ slug })) {
            slug = `${baseSlug}-${count}`;
            count++;
        }

        this.slug = slug;
    }
    next();
});

const Category = mongoose.model('Category', categorySchema);

module.exports = Category;