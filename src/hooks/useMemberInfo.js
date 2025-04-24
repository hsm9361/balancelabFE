// useMemberInfo.js
import { useState, useCallback } from 'react';
import { toast } from 'react-toastify';
import { memberService } from '../services/memberService';
import { genderOptions, activityLevelOptions } from '../constants/member';

export const useMemberInfo = () => {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [profileImage, setProfileImage] = useState(null);
  const [profileImageUrl, setProfileImageUrl] = useState(null);

  const fetchMemberInfo = useCallback(async () => {
    try {
      const data = await memberService.getMemberInfo();

      const genderOption = data.gender
        ? genderOptions.find((opt) => opt.value === data.gender)
        : null;

      const activityLevelOption = data.activityLevel
        ? activityLevelOptions.find((opt) => opt.value === data.activityLevel)
        : null;

      const info = {
        membername: data.membername || '',
        height: data.height != null ? data.height.toString() : '',
        weight: data.weight != null ? data.weight.toString() : '',
        age: data.age != null ? data.age.toString() : '',
        birthDate: data.birthDate || '1990-01-01',
        gender: genderOption ? { value: genderOption.value, label: genderOption.label } : null,
        activityLevel: activityLevelOption ? { value: activityLevelOption.value, label: activityLevelOption.label } : null,
        goalWeight: data.goalWeight != null ? data.goalWeight.toString() : '',
      };

      setProfileImageUrl(data.profileImageUrl || null);
      setLoading(false);
      return info;
    } catch (err) {
      console.error('Fetch error:', err);
      if (err.message === 'Authentication required') {
        localStorage.setItem('redirectPath', window.location.pathname);
        window.location.href = '/login';
        return;
      }
      setError(`회원 정보를 불러오는데 실패했습니다: ${err.message}`);
      setLoading(false);
      throw err;
    }
  }, []);

  const updateMemberInfo = useCallback(async (data, profileImage) => {
    if (!data && !profileImage) return;

    try {
      const formData = new FormData();
      const dto = {
        membername: data.membername || '',
        height: parseFloat(data.height),
        weight: parseFloat(data.weight),
        age: parseInt(data.age),
        birthDate: data.birthDate || '1990-01-01',
        gender: data.gender?.value || '',
        activityLevel: data.activityLevel?.value || '',
        goalWeight: parseFloat(data.goalWeight),
      };
      formData.append('dto', new Blob([JSON.stringify(dto)], { type: 'application/json' }));
      if (profileImage) formData.append('profileImage', profileImage);

      await memberService.updateMemberInfo(formData);
      await fetchMemberInfo();
      setProfileImage(null);
      setError(null);

      toast.success('저장되었습니다!', {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } catch (err) {
      console.error('Submit error:', err);
      if (err.message === 'Authentication required') {
        localStorage.setItem('redirectPath', window.location.pathname);
        window.location.href = '/login';
        return;
      }
      setError(`회원 정보 수정에 실패했습니다: ${err.message}`);
      toast.error(`저장 실패: ${err.message}`, {
        position: 'top-right',
        autoClose: 3000,
      });
    }
  }, [fetchMemberInfo]);

  const clearProfileImage = useCallback(() => {
    setProfileImage(null);
    setProfileImageUrl(null);
  }, []);

  return {
    error,
    loading,
    profileImage,
    setProfileImage,
    profileImageUrl,
    setProfileImageUrl,
    fetchMemberInfo,
    updateMemberInfo,
    clearProfileImage,
    setError,
  };
};
