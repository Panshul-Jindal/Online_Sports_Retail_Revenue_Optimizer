CREATE TABLE Users (
  "user_id" SERIAL PRIMARY KEY,
  "name" VARCHAR(255) NOT NULL,
  "email" VARCHAR(255) UNIQUE NOT NULL,

  "password_hash" VARCHAR(255) NOT NULL,
  "role" VARCHAR(50) NOT NULL CHECK (role IN ('admin', 'customer', 'market analyst','sales manager','customer support'))
);

CREATE TABLE Suppliers (
  "supplier_id" SERIAL PRIMARY KEY,
  "name"  VARCHAR(255) NOT NULL,

  "contact_number" VARCHAR(20) UNIQUE NOT NULL,

  "email" VARCHAR(255) UNIQUE NOT NULL,

  "category_id" INT NOT NULL REFERENCES Categories(category_id),

  "brand_id" INT NOT NULL REFERENCES Brand(brand_id)

);

CREATE TABLE Products (
  product_id SERIAL PRIMARY KEY,
  "name" VARCHAR(255) NOT NULL,
  brand_id INT NOT NULL REFERENCES Brand(brand_id),
  category_id INT NOT NULL REFERENCES Categories(category_id),
  cost_price DECIMAL(10,2) NOT NULL CHECK (cost_price > 0),
  selling_price DECIMAL(10,2) NOT NULL ,
  mrp DECIMAL(10,2) NOT NULL CHECK (mrp >= selling_price),
  supplier_id INT NOT NULL REFERENCES Suppliers(supplier_id),
  average_rating DECIMAL(4,2) CHECK (average_rating BETWEEN 1 AND 5)
);

-- To check
CREATE TABLE "Categories" (
  "category_id" SERIAL PRIMARY KEY,
  "name" VARCHAR(255) UNIQUE NOT NULL,
  "parent_category_id" integer REFERENCES Categories(category_id),
  "gender"  VARCHAR(20) CHECK (gender IN ('male', 'female', 'unisex', 'kids', 'other')),
  "description" text
);
-- To check
CREATE TABLE "Brand" (
  "brand_id" SERIAL PRIMARY KEY,
  "name" VARCHAR(255) UNIQUE NOT NULL
);


CREATE TABLE Customer_Reviews (
  user_id INT NOT NULL REFERENCES Users(user_id),
  product_id INT NOT NULL REFERENCES Products(product_id),
  rating INT NOT NULL CHECK (rating BETWEEN 1 AND 5),
  review_text TEXT,
  review_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (user_id, product_id)
);



CREATE TABLE Inventory (
  product_id INT PRIMARY KEY REFERENCES Products(product_id),
  current_stock INT NOT NULL CHECK (current_stock >= 0),
  low_stock_threshold INT NOT NULL CHECK (low_stock_threshold >= 0),
  last_updated TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE Vendor_Orders (
  id SERIAL,
  product_id INT NOT NULL REFERENCES Products(product_id),
  vendor_id INT NOT NULL REFERENCES Users(user_id),
  quantity INT NOT NULL CHECK (quantity > 0),
  cost_price DECIMAL(10,2) NOT NULL,
  amount DECIMAL(10,2) GENERATED ALWAYS AS (quantity * cost_price) STORED,
  date TIMESTAMP NOT NULL,
  PRIMARY KEY (id, product_id, vendor_id)
);

CREATE TABLE Orders (
  order_id SERIAL PRIMARY KEY,
  user_id INT NOT NULL REFERENCES Users(user_id),
  order_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  total_amount DECIMAL(10,2) CHECK (total_amount > 0),
  status VARCHAR(20) NOT NULL CHECK (status IN ('Completed', 'Returned')),
  coupon_code VARCHAR(20) REFERENCES Coupons(code)
);


CREATE TABLE Order_Items (
  order_id INT NOT NULL REFERENCES Orders(order_id) ON DELETE CASCADE  ,
  product_id INT NOT NULL REFERENCES Products(product_id),
  quantity INT NOT NULL CHECK (quantity > 0),
  selling_price DECIMAL(10,2) NOT NULL,
  Primary key (order_id, product_id)
);

-- Need to modify payments
CREATE TABLE "Payments" (
  "payment_id" SERIAL PRIMARY KEY,
  "order_id" integer REFERENCES "Orders" ("order_id"),
  "user_id" integer REFERENCES "Users" ("user_id"),
  "payment_method" text,
  "transaction_id" text,
  "date" TIMESTAMP,
  "amount_paid" decimal(10,2),
  "status" text
);


CREATE TABLE Shipping (
  order_id INT UNIQUE NOT NULL REFERENCES Orders(order_id) PRIMARY KEY,
  tracking_number VARCHAR(255) UNIQUE NOT NULL,
  status VARCHAR(50) NOT NULL CHECK (status IN ('processing', 'shipped', 'delivered'))
);

CREATE TABLE "Pricing_Strategies" (
  "strategy_id" SERIAL PRIMARY KEY,
  "price_change_reason" text,
  "percentage_change" integer NOT NULL,
  "start_date" TIMESTAMP NOT NULL,
  "end_date" TIMESTAMP NOT NULL CHECK(end_date > start_date)
);

CREATE TABLE "Stock_Strategies" (
  "strategy_id" SERIAL PRIMARY KEY,
  "stock_change_reason" text,
  "percentage_change" integer NOT NULL,
  "start_date"  TIMESTAMP NOT NULL,
  "end_date" TIMESTAMP NOT NULL CHECK(end_date > start_date)
);

CREATE TABLE Marketing_Campaigns (
  campaign_id SERIAL PRIMARY KEY,
  campaign_name VARCHAR(255)  NOT NULL,
  start_date TIMESTAMP NOT NULL,
  end_date TIMESTAMP NOT NULL CHECK (end_date > start_date),
  category_id INT REFERENCES Categories(category_id),
  brand_id INT REFERENCES Brand(brand_id)
);


CREATE TABLE "Marketing_Campaigns_Items" (
  "campaign_id" integer REFERENCES "Marketing_Campaigns" ("campaign_id"),
  "product_id" integer REFERENCES "Products" ("product_id"),
  "pricing_strategy_id" int REFERENCES "Pricing_Strategies" ("strategy_id"),
  "stock_strategy_id" int REFERENCES "Stock_Strategies" ("strategy_id"),
  PRIMARY KEY ("campaign_id", "product_id")
);






CREATE TABLE "Wishlist" (
  "user_id" integer REFERENCES "Users" ("user_id") ,
  "product_id" integer REFERENCES "Products" ("product_id"),
  PRIMARY KEY ("user_id", "product_id")
);



CREATE TABLE "Returns" (
  "order_id" integer REFERENCES "Orders" ("order_id"),
  "user_id" integer REFERENCES "Users" ("user_id"), 
  "status" varchar(10) CHECK (status in ('Successful','Pending')),
  "reason" text,
  PRIMARY KEY ("order_id")
);



CREATE TABLE "Replacements" (
  "order_id" integer REFERENCES "Orders" ("order_id"),
  "user_id" integer REFERENCES "Users" ("user_id"),
  "status" varchar(10) CHECK (status in ('Successful','Pending')),,
  "reason" text,
  PRIMARY KEY ("order_id")
);



CREATE TABLE "Notifications" (
  "notification_id" SERIAL PRIMARY KEY,
  "user_id" integer REFERENCES "Users" ("user_id"),
  "message" text,
  "date_sent" TIMESTAMP
);


CREATE TABLE Coupons (
  code VARCHAR(20) PRIMARY KEY,
  discount_percentage DECIMAL(5,2) NOT NULL CHECK (discount_percentage BETWEEN 0 AND 100),
  valid_from TIMESTAMP NOT NULL,
  valid_until TIMESTAMP NOT NULL CHECK (valid_until > valid_from)
);









ALTER TABLE Suppliers 
ADD CHECK (contact_number ~ '^\+91[6-9]\d{9}$');



ALTER TABLE Users
ADD CHECK (email ~* '^[A-Za-z0-9._%-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$');







