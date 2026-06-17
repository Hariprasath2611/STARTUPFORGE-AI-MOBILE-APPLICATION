import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useAuthStore } from '../store/useAuthStore';
import { Colors } from '../theme/colors';

export default function SubscriptionScreen() {
  const { user, updateProfile } = useAuthStore();

  const plans = [
    { name: 'Free', price: '$0', desc: 'Test validation models.', perks: ['1 Startup validation', 'Basic AI Advisor chat', 'No PDF exports'] },
    { name: 'Starter', price: '$29/mo', desc: 'Great for solo builders.', perks: ['5 Startup validations', 'competitor sweeps', 'Basic forecasts'] },
    { name: 'Pro', price: '$99/mo', desc: 'Full incubator access.', perks: ['Unlimited validations', 'Full business planning Swarm', 'RAG Document integrations', 'Cofounder vectors'] },
    { name: 'Enterprise', price: '$499/mo', desc: 'Accelerator scale.', perks: ['Custom LangChain agents', 'Dedicated ML predictor matrix', 'SLA support'] }
  ];

  const handleCheckout = (planName: any) => {
    Alert.alert(
      'Stripe Payment Sheet',
      `Launch Stripe mobile payment gateway for ${planName}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Complete Payment', 
          onPress: () => {
            updateProfile({ subscriptionPlan: planName });
            Alert.alert('Success', `Subscription updated to ${planName}!`);
          } 
        }
      ]
    );
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.header}>Accelerator Subscription Tiers</Text>
      <Text style={styles.sub}>Choose a subscription plan to unlock LangChain agent Swarms and ML prediction frameworks.</Text>

      <Text style={styles.currentTier}>Current plan: <Text style={{ color: Colors.primary, fontWeight: 'bold' }}>{user?.subscriptionPlan || 'Free'}</Text></Text>

      {plans.map((plan, idx) => (
        <View key={idx} style={[
          styles.planCard,
          user?.subscriptionPlan === plan.name ? { borderColor: Colors.primary, borderWidth: 2 } : null
        ]}>
          <View style={styles.row}>
            <View>
              <Text style={styles.planName}>{plan.name}</Text>
              <Text style={styles.planDesc}>{plan.desc}</Text>
            </View>
            <Text style={styles.planPrice}>{plan.price}</Text>
          </View>

          <View style={styles.divider} />

          {plan.perks.map((perk, i) => (
            <Text key={i} style={styles.perkText}>✓ {perk}</Text>
          ))}

          <TouchableOpacity 
            style={[
              styles.subscribeBtn, 
              user?.subscriptionPlan === plan.name ? { backgroundColor: Colors.surface, borderWidth: 1, borderColor: Colors.border } : null
            ]}
            onPress={() => handleCheckout(plan.name)}
            disabled={user?.subscriptionPlan === plan.name}
          >
            <Text style={styles.btnText}>
              {user?.subscriptionPlan === plan.name ? 'Active Plan' : `Upgrade to ${plan.name}`}
            </Text>
          </TouchableOpacity>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    color: Colors.text,
    fontSize: 22,
    fontWeight: 'bold',
  },
  sub: {
    color: Colors.mutedText,
    fontSize: 13,
    marginTop: 6,
    lineHeight: 18,
  },
  currentTier: {
    color: Colors.text,
    fontSize: 14,
    marginVertical: 20,
    backgroundColor: Colors.surface,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  planCard: {
    backgroundColor: Colors.surface,
    borderColor: Colors.border,
    borderWidth: 1,
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  planName: {
    color: Colors.text,
    fontSize: 18,
    fontWeight: 'bold',
  },
  planDesc: {
    color: Colors.mutedText,
    fontSize: 12,
    marginTop: 4,
  },
  planPrice: {
    color: Colors.accent,
    fontSize: 20,
    fontWeight: 'bold',
  },
  divider: {
    height: 1,
    backgroundColor: Colors.border,
    my: 16,
    marginVertical: 16,
  },
  perkText: {
    color: Colors.mutedText,
    fontSize: 12,
    marginBottom: 8,
  },
  subscribeBtn: {
    backgroundColor: Colors.primary,
    borderRadius: 8,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
  },
  btnText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 13,
  }
});
