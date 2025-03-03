"use client";

import { useForm } from "react-hook-form";
import * as yup from "yup";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { yupResolver } from "@hookform/resolvers/yup";

// Validation Schema using Zod
const formSchema = yup.object().shape({
  username: yup.string().required("กรุณากรอกชื่อผู้ใช้"),
  shopName: yup.string().required("กรุณากรอกชื่อร้านค้า"),
  shopDetails: yup.string().required("กรุณากรอกรายละเอียดร้านค้า"),
  email: yup.string().email("อีเมลไม่ถูกต้อง").required("กรุณากรอกอีเมล"),
  phone: yup.string().matches(/^\d{10}$/, "เบอร์โทรศัพท์ต้องมี 10 หลัก").required("กรุณากรอกเบอร์โทรศัพท์"),
  address: yup.string().required("กรุณากรอกที่อยู่"),
  district: yup.string().required("กรุณาเลือกเขตที่อยู่ปัจจุบัน"),
});

const ServiceProviderForm = () => {
  const form = useForm({
    resolver: yupResolver(formSchema),
    defaultValues: {
      username: "",
      shopName: "",
      shopDetails: "",
      email: "",
      phone: "",
      address: "",
      district: "",
    },
  });

  const onSubmit = async (data) => {
    console.log("Form Submitted:", data);
    // TODO: Add API call to submit form data
  };

  return (
    <div className="flex flex-col min-h-screen items-center bg-[#FFF8D6]">
      <h2 className="text-3xl font-semibold text-center mt-10">สร้างบัญชี Service Provider - ข้อมูลร้านค้า</h2>
      
      <div className="w-9/12 bg-white p-6 rounded-lg shadow-md mt-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col">
            <div className="grid grid-cols-2 gap-4">
              
              {/* Username */}
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-semibold">Username</FormLabel>
                    <FormControl>
                      <Input className="rounded-xl" placeholder="username" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Shop Name */}
              <FormField
                control={form.control}
                name="shopName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-semibold">ชื่อร้านค้า</FormLabel>
                    <FormControl>
                      <Input className="rounded-xl" placeholder="ชื่อร้านค้า" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Shop Details */}
            <FormField
              control={form.control}
              name="shopDetails"
              render={({ field }) => (
                <FormItem className="col-span-2 flex flex-col mt-4">
                  <FormLabel className="font-semibold">รายละเอียดร้านค้า</FormLabel>
                  <FormControl>
                    <textarea className="pt-1 pl-1 rounded-xl bg-[#C6C6C6] placeholder:text-white h-14" placeholder="รายละเอียดร้านค้า" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Email */}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem className="mt-2">
                  <FormLabel className="font-semibold">Email</FormLabel>
                  <FormControl>
                    <Input className="rounded-xl" type="email" placeholder="email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Phone */}
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem className="mt-2">
                  <FormLabel className="font-semibold">เบอร์โทรศัพท์</FormLabel>
                  <FormControl>
                    <Input className="rounded-xl" type="tel" placeholder="เบอร์โทรศัพท์" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4 mt-2 mb-6">
              
              {/* Address */}
              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-semibold">ที่อยู่ร้านค้า</FormLabel>
                    <FormControl>
                      <textarea className="pt-1 pl-1 w-full rounded-xl bg-[#C6C6C6] placeholder:text-white h-16" placeholder="ที่อยู่ร้านค้า" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* district Dropdown */}
              <FormField
                control={form.control}
                name="district"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-semibold">เขตที่ตั้งร้านค้า</FormLabel>
                    <FormControl>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <SelectTrigger className="w-full rounded-xl bg-[#C6C6C6] text-white placeholder:text-white">
                          <SelectValue placeholder="เลือกเขตที่ตั้งร้านค้า" />
                        </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="เขตสายไหม">เขตสายไหม</SelectItem>
                            <SelectItem value="เขตจตุจักร">เขตจตุจักร</SelectItem>
                            <SelectItem value="เขตหลักสี่">เขตหลักสี่</SelectItem>
                            <SelectItem value="เขตดอนเมือง">เขตดอนเมือง</SelectItem>
                            <SelectItem value="เขตบางซื่อ">เขตบางซื่อ</SelectItem>
                            <SelectItem value="เขตลาดพร้าว">เขตลาดพร้าว</SelectItem>
                            <SelectItem value="เขตสะพานสูง">เขตสะพานสูง</SelectItem>
                            <SelectItem value="เขตบางเขน">เขตบางเขน</SelectItem>
                            <SelectItem value="เขตหนองจอก">เขตหนองจอก</SelectItem>
                            <SelectItem value="เขตบางกะปิ">เขตบางกะปิ</SelectItem>
                            <SelectItem value="เขตประเวศ">เขตประเวศ</SelectItem>
                            <SelectItem value="เขตลาดกระบัง">เขตลาดกระบัง</SelectItem>
                            <SelectItem value="เขตบึงกุ่ม">เขตบึงกุ่ม</SelectItem>
                            <SelectItem value="เขตคันนายาว">เขตคันนายาว</SelectItem>
                            <SelectItem value="เขตมีนบุรี">เขตมีนบุรี</SelectItem>
                            <SelectItem value="เขตคลองสามวา">เขตคลองสามวา</SelectItem>
                            <SelectItem value="เขตวัฒนา">เขตวัฒนา</SelectItem>
                            <SelectItem value="เขตสวนหลวง">เขตสวนหลวง</SelectItem>
                            <SelectItem value="เขตพระโขนง">เขตพระโขนง</SelectItem>
                            <SelectItem value="เขตสาทร">เขตสาทร</SelectItem>
                            <SelectItem value="เขตคลองเตย">เขตคลองเตย</SelectItem>
                            <SelectItem value="เขตบางคอแหลม">เขตบางคอแหลม</SelectItem>
                            <SelectItem value="เขตปทุมวัน">เขตปทุมวัน</SelectItem>
                            <SelectItem value="เขนบางรัก">เขนบางรัก</SelectItem>
                            <SelectItem value="เขตยานนาวา">เขตยานนาวา</SelectItem>
                            <SelectItem value="เขตบางนา">เขตบางนา</SelectItem>
                            <SelectItem value="เขตบางพลัด">เขตบางพลัด</SelectItem>
                            <SelectItem value="เขตบางกอกน้อย">เขตบางกอกน้อย</SelectItem>
                            <SelectItem value="เขตบางกอกใหญ่">เขตบางกอกใหญ่</SelectItem>
                            <SelectItem value="เขตตลิ่งชัน">เขตตลิ่งชัน</SelectItem>
                            <SelectItem value="เขตทวีวัฒนา">เขตทวีวัฒนา</SelectItem>
                            <SelectItem value="เขตจอมทอง">เขตจอมทอง</SelectItem>
                            <SelectItem value="เขตธนบุรี">เขตธนบุรี</SelectItem>
                            <SelectItem value="เขตคลองสาน">เขตคลองสาน</SelectItem>
                            <SelectItem value="เขตบางขุนเทียน">เขตบางขุนเทียน</SelectItem>
                            <SelectItem value="เขตบางแค">เขตบางแค</SelectItem>
                            <SelectItem value="เขตหนองแขม">เขตหนองแขม</SelectItem>
                            <SelectItem value="เขตภาษีเจริญ">เขตภาษีเจริญ</SelectItem>
                            <SelectItem value="เขตบางบอน">เขตบางบอน</SelectItem>
                            <SelectItem value="เขตทุ่งครุ">เขตทุ่งครุ</SelectItem>
                            <SelectItem value="เขตราษฏร์บูรณะ">เขตราษฏร์บูรณะ</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Buttons */}
            <div className="col-span-2 flex justify-center gap-4">
              <Button type="submit" variant="default" disabled={form.formState.isSubmitting}>
                ถัดไป
              </Button>
              <Button type="button" variant="destructive" onClick={() => form.reset()}>
                ยกเลิก
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default ServiceProviderForm;
