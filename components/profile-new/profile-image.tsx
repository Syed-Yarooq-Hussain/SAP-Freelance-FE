'use client'

import Image from 'next/image'
import { Camera, User } from 'lucide-react'
import { sanitizeUrl } from '@/utils/common'
import { getConsultantMeService } from '@/services/getConsultantProfile'
import { updateUser } from '@/lib/store/features/user/userSlice'
import { useAppDispatch, useAppSelector } from '@/lib/store/hook'
import { request } from '@/utils/request'

interface ProfileImageProps {
  imageUrl?: string
  name: string
  initials?: string
}

export function ProfileImage({ imageUrl, name, initials }: ProfileImageProps) {
  const user = useAppSelector((state) => state?.user?.user);
  const dispatch = useAppDispatch();

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
  
    const formData = new FormData();
    formData.append('file', file);
  
    const result = await request<FormData, { url: string }>({
      url: `/consultants/upload-profile/${user?.user?.id}`,
      method: "POST",
      data: formData,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  
    const url = sanitizeUrl(result?.data?.url);
    if(url){
      const consultantData = await getConsultantMeService();
          
      if (consultantData?.data) {
        dispatch(updateUser({ user: consultantData.data }));
      }      
    }
  };
  

  return (
    <div className="relative w-56 h-56 mx-auto p-3 shadow-2xl rounded-3xl">
      {user?.user?.avatar ? (
        <Image
          src={user?.user?.avatar || ''}
          alt={user?.user?.username || ''}
          width={192}
          height={192}
          className="w-full h-full rounded-3xl object-cover border-4 border-white shadow-lg"
        />
      ) : (
        <div className="cursor-pointer w-full h-full border border-slate-200 border-dashed bg-inactive rounded-3xl flex flex-col items-center justify-center">
         <label htmlFor='profile-image-input' className='cursor-pointer flex flex-col items-center justify-center gap-2'>
          <input type="file" accept="image/*" onChange={handleImageUpload} className='hidden' id='profile-image-input' />
          <Camera className='w-12 h-12 text-slate-500' />
          <p className='text-md text-slate-500'>Upload Photo</p>
         </label>
        </div>
      )}
    </div>
  )
}
