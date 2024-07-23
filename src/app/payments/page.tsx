import { Payment, columns } from "./columns"
import { DataTable } from "./data-table"

async function getData(): Promise<Payment[]> {
  // Fetch data from your API here.
  return [
    {
      "id": "728ed52f",
      "amount": 100,
      "status": "pending",
      "email": "m@example.com",
    },
    {
        "id": "9efde1ef",
        "amount": 497,
        "status": "failed",
        "email": "user87@demo.com"
      },
      {
        "id": "2b0b2d26",
        "amount": 839,
        "status": "pending",
        "email": "user92@example.com"
      },
      {
        "id": "d443741a",
        "amount": 872,
        "status": "completed",
        "email": "user41@test.com"
      },
      {
        "id": "310864aa",
        "amount": 25,
        "status": "completed",
        "email": "user45@demo.com"
      },
      {
        "id": "8f7bab33",
        "amount": 457,
        "status": "completed",
        "email": "user97@example.com"
      },
      {
        "id": "89ff897b",
        "amount": 923,
        "status": "completed",
        "email": "user16@test.com"
      },
      {
        "id": "5594cda0",
        "amount": 609,
        "status": "pending",
        "email": "user19@demo.com"
      },
      {
        "id": "018c748b",
        "amount": 539,
        "status": "completed",
        "email": "user62@example.com"
      },
      {
        "id": "759b341d",
        "amount": 607,
        "status": "failed",
        "email": "user28@test.com"
      },
      {
        "id": "7783559c",
        "amount": 789,
        "status": "completed",
        "email": "user52@demo.com"
      },
      {
        "id": "a801a1c3",
        "amount": 66,
        "status": "pending",
        "email": "user53@test.com"
      },
      {
        "id": "3bd50184",
        "amount": 896,
        "status": "completed",
        "email": "user17@demo.com"
      },
      {
        "id": "5268eafe",
        "amount": 177,
        "status": "failed",
        "email": "user53@test.com"
      },
      {
        "id": "236797bd",
        "amount": 463,
        "status": "completed",
        "email": "user95@demo.com"
      },
      {
        "id": "26ad60cd",
        "amount": 360,
        "status": "completed",
        "email": "user22@test.com"
      },
      {
        "id": "195c1f74",
        "amount": 601,
        "status": "pending",
        "email": "user23@demo.com"
      },
      {
        "id": "568ffaf1",
        "amount": 985,
        "status": "pending",
        "email": "user87@example.com"
      },
      {
        "id": "193e1bff",
        "amount": 701,
        "status": "pending",
        "email": "user31@demo.com"
      },
      {
        "id": "f00fa05c",
        "amount": 655,
        "status": "completed",
        "email": "user56@test.com"
      },
      {
        "id": "7eab44c0",
        "amount": 643,
        "status": "completed",
        "email": "user19@example.com"
      },
      {
        "id": "9cde9b8e",
        "amount": 883,
        "status": "pending",
        "email": "user30@demo.com"
      },
      {
        "id": "8082f247",
        "amount": 472,
        "status": "failed",
        "email": "user70@test.com"
      },
      {
        "id": "76df070e",
        "amount": 152,
        "status": "completed",
        "email": "user46@demo.com"
      },
      {
        "id": "89021d09",
        "amount": 527,
        "status": "failed",
        "email": "user19@demo.com"
      },
      {
        "id": "c288c23a",
        "amount": 527,
        "status": "failed",
        "email": "user51@test.com"
      },
      {
        "id": "4efa8ac3",
        "amount": 900,
        "status": "pending",
        "email": "user73@demo.com"
      },
      {
        "id": "3622adb3",
        "amount": 271,
        "status": "completed",
        "email": "user35@example.com"
      },
      {
        "id": "e5a17d70",
        "amount": 776,
        "status": "completed",
        "email": "user24@demo.com"
      },
      {
        "id": "e48c60be",
        "amount": 216,
        "status": "failed",
        "email": "user21@test.com"
      },
      {
        "id": "e83295a0",
        "amount": 217,
        "status": "failed",
        "email": "user56@demo.com"
      }
    ]
}

export default async function DemoPage() {
  const data = await getData()

  return (
    <div className="container mx-auto py-10">
      <DataTable columns={columns} data={data} />
    </div>
  )
}
