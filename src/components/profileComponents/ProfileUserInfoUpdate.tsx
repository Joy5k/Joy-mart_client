import { useGetProfileQuery, useUpdateProfileMutation } from "@/src/redux/features/profile/profileApi";
import { useState } from "react";
import { toast } from "react-toastify";

function ProfileUserInfoUpdate({setIsEditing,setImagePreview,updatedData,setUpdatedData}:any) {
      const [isLoading, setIsLoading] = useState(false);
   
const { data, refetch } = useGetProfileQuery({});
  const user = data?.data;
     const [updateProfile] = useUpdateProfileMutation();
    
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUpdatedData((prev: typeof updatedData) => ({
      ...prev,
      [name]: value
    }));
  };
     const handleSaveProfile = async () => {
        setIsLoading(true);
        try {
          const res = await updateProfile({ updatedData }).unwrap();
          if (res) {
            toast.success('Profile updated successfully');
            refetch(); // Refetch the latest data
            setIsEditing(false);
          }
        } catch (error: any) {
          console.error('Error updating profile:', error);
          toast.error(error.data?.message || 'Failed to update profile');
        } finally {
          setIsLoading(false);
        }
      };


  return (
    <div>
         <div className="space-y-4 w-full">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                      <input
                        type="text"
                        name="firstName"
                        value={updatedData.firstName}
                        onChange={handleInputChange}
                        placeholder='John'
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#088178] focus:border-[#088178] outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                      <input
                        type="text"
                        name="lastName"
                        value={updatedData.lastName}
                        onChange={handleInputChange}
                        placeholder='Doe'
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#088178] focus:border-[#088178] outline-none"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input
                      type="email"
                      name="email"
                      value={updatedData.email}
                      onChange={handleInputChange}
                      placeholder='john@gmail.com'
                      disabled
                      readOnly
                      className="w-full px-4 py-2 border rounded-lg  outline-none text-[#088178]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                    <input
                      type="tel"
                      name="phoneNumber"
                      value={updatedData.phoneNumber}
                      onChange={handleInputChange}
                      placeholder='+88016*********'
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#088178] focus:border-[#088178] outline-none"
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
                      <input
                        type="date"
                        name="dateOfBirth"
                        value={updatedData.dateOfBirth}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#088178] focus:border-[#088178] outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                      <input
                        type="text"
                        name="address"
                        value={updatedData.address}
                        onChange={handleInputChange}
                        placeholder='123 Main St, New York, NY 10001'
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#088178] focus:border-[#088178] outline-none"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                      <input
                        type="text"
                        name="city"
                        value={updatedData.city}
                        onChange={handleInputChange}
                        placeholder='New York'
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#088178] focus:border-[#088178] outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                      <input
                        type="text"
                        name="state"
                        value={updatedData.state}
                        onChange={handleInputChange}
                        placeholder='New York'
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#088178] focus:border-[#088178] outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Zip Code</label>
                      <input
                        type="text"
                        name="zipCode"
                        value={updatedData.zipCode}
                        onChange={handleInputChange}
                        placeholder='10001'
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#088178] focus:border-[#088178] outline-none"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                    <input
                      type="text"
                      name="country"
                      value={updatedData.country}
                      onChange={handleInputChange}
                      placeholder='USA'
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#088178] focus:border-[#088178] outline-none"
                    />
                  </div>
                  <div className="flex justify-end space-x-3 pt-4">
                    <button
                      onClick={() => {
                        setIsEditing(false);
                        setImagePreview(user?.image || null);
                      }}
                      className="px-4 py-2 border border-gray-300 rounded-lg font-medium"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSaveProfile}
                      disabled={isLoading}
                      className="px-6 py-2 bg-[#088178] text-white rounded-lg font-medium flex items-center gap-2"
                    >
                      {isLoading ? 'Saving...' : 'Save Changes'}
                    </button>
                  </div>
                </div>
    </div>
  )
}

export default ProfileUserInfoUpdate