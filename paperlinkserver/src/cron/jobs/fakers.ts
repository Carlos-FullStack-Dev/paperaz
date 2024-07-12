import app from "../../app"
import { DEFAULT_VALUES } from "../../utils/constants"

export const fakers =async()=>{
  try {
    await app.services.users.create({
        email: "user@test.com",
        password: "password",
        firstName:  "airdvert",
        lastName: "Doe",
        phone:"+19028814649",
        isEmailVerified: true,
        country:"US",
        companyName:"lux",
    })
  } catch (error) {

  }
  try {
    await app.services.users.create({
        email: "user2@test.com",
        password: "password",
        firstName:  "John",
        lastName: "Doe",
        phone:"+190288146400",
        isEmailVerified: true,
        country:"US",
        companyName:"lux1",
    })
  } catch (error) {

  }
  try {
    await app.services.users.create({
        email: "isaac@test.com",
        password: "password",
        firstName:  "Isaac",
        lastName: "Doe",
        phone:"+190288146009",
        isEmailVerified: true,
        country:"US",
        companyName:"lux3",
    })
  } catch (error) {

  }
  try {
    await app.services.users.create({
        email: "lucy@test.com",
        password: "password",
        firstName:  "lucy",
        lastName: "lake",
        phone:"+190288111149",
        isEmailVerified: true,
        country:"US",
        companyName:"lux44",
    })
  } catch (error) {

  }

  try {
    await app.services.users.create({
        email: "admin@test.com",
        password: "password",
        firstName:  "John",
        lastName: "Doe",
        phone:"+19028814643",
        isEmailVerified: true,
        country:"US",
        role:"super_admin",
        companyName:"lux11",
    })
  } catch (error) {

  }

  // try {
  //   await app.services["daily-activies"].create({
  //       email: "admin@test.com",
  //       password: "password",
  //       firstName:  "John",
  //       lastName: "Doe",
  //       phone:"+19028814643",
  //       country:"US",
  //       role:"super_admin"
  //   })
  // } catch (error) {

  // }



}
