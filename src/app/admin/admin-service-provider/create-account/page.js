"use client";

import { useForm } from "react-hook-form";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const ServiceProviderForm = () => {
  const form = useForm({
    defaultValues: {
      username: "",
      shopName: "",
      shopDetails: "",
      email: "",
      phone: "",
      address: "",
      location: "",
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

            {/* Location Dropdown */}
            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-semibold">เขตที่ตั้งร้านค้า</FormLabel>
                  <FormControl>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <SelectTrigger className="w-full rounded-xl bg-[#C6C6C6] text-white placeholder:text-white">
                        <SelectValue placeholder="เลือกเขตที่ตั้งร้านค้า" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="central">Central</SelectItem>
                        <SelectItem value="north">North</SelectItem>
                        <SelectItem value="south">South</SelectItem>
                        <SelectItem value="east">East</SelectItem>
                        <SelectItem value="west">West</SelectItem>
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
            <Button type="submit" variant="default">ถัดไป</Button>
            <Button type="button" variant="destructive">ยกเลิก</Button>
          </div>
        </form>
      </Form>
    </div>
    </div>
  );
};

export default ServiceProviderForm;
