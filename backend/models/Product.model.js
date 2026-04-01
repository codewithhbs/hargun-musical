const mongoose = require("mongoose");
const slugify = require('slugify');

const varient_schema = new mongoose.Schema({
    quantity: {
        type: String,

    },
    price: {
        type: Number,

    },
    price_after_discount: {
        type: Number,

    },
    discount_percentage: {
        type: Number,

    },
    isStock: {
        type: Boolean,

    },
    stock_quantity: {
        type: Number,

    },
});

const Product_Schema = new mongoose.Schema(
    {
        product_name: {
            type: String,
            required: true,
        },
        product_description: {
            type: String,
            required: true,
        },
        ProductMainImage: {
            url: {
                type: String,
            },
            public_id: {
                type: String,
            },
        },
        SecondImage: {
            url: {
                type: String,
            },
            public_id: {
                type: String,
            },
        },
        ThirdImage: {
            url: {
                type: String,
            },
            public_id: {
                type: String,
            },
        },
        FourthImage: {
            url: {
                type: String,
            },
            public_id: {
                type: String,
            },
        },
        FifthImage: {
            url: {
                type: String,
            },
            public_id: {
                type: String,
            },
        },
        price: {
            type: Number,

        },
        discount: {
            type: Number,
            default: 0,
        },
        afterDiscountPrice: {
            type: Number,
            default: null,
        },
        stock: {
            type: Number,
            default: null,
        },
        isVarient: {
            type: Boolean,
            default: false,
        },
        Varient: [varient_schema],
        reviews: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
            },
        ],
        category: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Category",
        },
        sub_category: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "SubCategory",
            default: null,
        },
        extra_description: {
            type: String,
            default: null,
        },
        tag: {
            type: String,
        },
        isShowOnHomeScreen: {
            type: Boolean,
            default: false,
        },
        brand: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Brand",
        },
        slug: {
            type: String,
            unique: true
        }
    },
    {
        timestamps: { createdAt: true, updatedAt: false }
    }
);

// 🔥 Auto slug generate (UNIQUE)
Product_Schema.pre("save", async function (next) {
    try {
        if (this.isModified("product_name")) {
            let baseSlug = slugify(this.product_name, {
                lower: true,
                strict: true,
            });

            let slug = baseSlug;
            let count = 1;

            // unique slug check
            while (await mongoose.models.Product.findOne({ slug })) {
                slug = `${baseSlug}-${count}`;
                count++;
            }

            this.slug = slug;
        }

        // updatedAt logic
        if (this.isModified()) {
            this.updatedAt = new Date();
        }

        next();
    } catch (err) {
        next(err);
    }
});


Product_Schema.add({
    updatedAt: {
        type: Date,
        default: null,
    },
});

module.exports = mongoose.model("Product", Product_Schema);
