import { Link } from 'expo-router';
import { View, Button } from 'react-native';

export default function Home() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Link href="/chat" asChild>
        <Button title="Messages" onPress={() => {}} />
      </Link>
    </View>
  );
}
