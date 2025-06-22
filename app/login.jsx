import { useEffect } from 'react';
import { View } from 'react-native';
import { useRouter } from 'expo-router';

export default function Login() {
  const router = useRouter();
  
  useEffect(() => {
    router.replace('/');
  }, []);

  return <View />; // Empty view while redirecting
}