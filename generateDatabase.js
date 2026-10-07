import fs from "fs";

const CATEGORIES = [
  "Electronics",
  "Books",
  "Clothing",
  "Home",
  "Sports",
  "Office",
  "Kitchen",
  "Toys",
  "Beauty",
  "Garden",
  "Automotive",
  "Music",
  "Pets",
  "Health",
  "Outdoors",
];

const cities = [
  "Boston",
  "New York",
  "Chicago",
  "Miami",
  "Seattle",
  "Dallas",
  "Denver",
  "Phoenix",
  "Atlanta",
  "Houston",
];
const suppliers = [...Array(20)].map((_, i) => ({
  id: i + 1,
  name: `Supplier ${i + 1}`,
  country: ["USA", "Canada", "Germany", "Japan"][i % 4],
}));
const employees = [...Array(15)].map((_, i) => ({
  id: i + 1,
  name: `Employee ${i + 1}`,
  dept: ["Sales", "Support", "Online"][i % 3],
}));

let sql = [];

sql.push("-- Generated Store Seed\n");

sql.push("INSERT INTO Categories VALUES");
sql.push(CATEGORIES.map((c, i) => `(${i + 1},'${c}')`).join(",\n") + ";\n");

sql.push("INSERT INTO Suppliers VALUES");
sql.push(
  suppliers.map((s) => `(${s.id},'${s.name}','${s.country}')`).join(",\n") +
    ";\n",
);

sql.push("INSERT INTO Employees VALUES");
sql.push(
  employees.map((e) => `(${e.id},'${e.name}','${e.dept}')`).join(",\n") + ";\n",
);

sql.push("INSERT INTO Customers VALUES");
let customers = [];
for (let i = 1; i <= 100; i++) {
  customers.push(
    `(${i},'Customer ${i}','customer${i}@email.com','${cities[(i - 1) % cities.length]}')`,
  );
}
sql.push(customers.join(",\n") + ";\n");

sql.push("INSERT INTO Products VALUES");
let products = [];
for (let i = 1; i <= 200; i++) {
  let cat = ((i - 1) % 15) + 1;
  let sup = ((i - 1) % 20) + 1;
  let price = (10 + i * 3.75).toFixed(2);
  products.push(`(${i},'Product ${i}',${price},${cat},${sup})`);
}
sql.push(products.join(",\n") + ";\n");

sql.push("INSERT INTO Orders VALUES");
let orders = [];
for (let i = 1; i <= 500; i++) {
  let cust = ((i - 1) % 100) + 1;
  let emp = ((i - 1) % 15) + 1;
  let m = ((i - 1) % 12) + 1;
  let d = ((i - 1) % 28) + 1;
  let y = 2025 + Math.floor((i - 1) / 250);
  orders.push(
    `(${i},${cust},${emp},'${y}-${String(m).padStart(2, "0")}-${String(d).padStart(2, "0")}')`,
  );
}
sql.push(orders.join(",\n") + ";\n");

sql.push("INSERT INTO OrderItems VALUES");
let items = [],
  id = 1;
for (let o = 1; o <= 500; o++) {
  for (let j = 0; j < 3; j++) {
    let p = ((o + j * 17 - 1) % 200) + 1;
    let q = (j % 5) + 1;
    items.push(`(${id++},${o},${p},${q})`);
  }
}
sql.push(items.join(",\n") + ";\n");

sql.push("INSERT INTO Payments VALUES");
const methods = ["Credit Card", "PayPal", "Cash", "Apple Pay"];
let pays = [];
for (let i = 1; i <= 500; i++) {
  let m = ((i - 1) % 12) + 1,
    d = ((i - 1) % 28) + 1,
    y = 2025 + Math.floor((i - 1) / 250);
  pays.push(
    `(${i},${i},'${methods[i % 4]}','${y}-${String(m).padStart(2, "0")}-${String(d).padStart(2, "0")}')`,
  );
}
sql.push(pays.join(",\n") + ";\n");

sql.push("INSERT INTO Reviews VALUES");
let rev = [];
for (let i = 1; i <= 1000; i++) {
  let c = ((i - 1) % 100) + 1,
    p = ((i * 7 - 1) % 200) + 1,
    r = (i % 5) + 1;
  let m = ((i - 1) % 12) + 1,
    d = ((i - 1) % 28) + 1,
    y = 2025;
  rev.push(
    `(${i},${c},${p},${r},'${y}-${String(m).padStart(2, "0")}-${String(d).padStart(2, "0")}')`,
  );
}
sql.push(rev.join(",\n") + ";\n");

fs.writeFileSync("seed.sql", sql.join("\n"));
console.log("Generated seed.sql");
