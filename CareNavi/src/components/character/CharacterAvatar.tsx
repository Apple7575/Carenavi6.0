// T064: Character avatar component
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { CharacterStage } from '../../types';

interface CharacterAvatarProps {
  stage: CharacterStage;
  size?: number;
  testID?: string;
}

const STAGE_EMOJI: Record<CharacterStage, string> = {
  egg: '\ud83e\udd5a',
  chick: '\ud83d\udc23',
  chicken: '\ud83d\udc14',
  phoenix: '\ud83d\udd25',
};

const STAGE_NAME: Record<CharacterStage, string> = {
  egg: '\uc54c',
  chick: '\ubcd1\uc544\ub9ac',
  chicken: '\ub2ed',
  phoenix: '\ubd88\uc0ac\uc870',
};

export default function CharacterAvatar({
  stage,
  size = 100,
  testID,
}: CharacterAvatarProps) {
  return (
    <View
      testID={testID}
      style={[
        styles.container,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
        },
      ]}
    >
      <Text style={[styles.emoji, { fontSize: size * 0.5 }]}>
        {STAGE_EMOJI[stage]}
      </Text>
      <Text style={styles.stageName}>{STAGE_NAME[stage]}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
  },
  emoji: {
    textAlign: 'center',
  },
  stageName: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
});
