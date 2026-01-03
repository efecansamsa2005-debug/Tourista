import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, SafeAreaView, StatusBar, KeyboardAvoidingView, Platform, ScrollView, Alert, ActivityIndicator, Image, Dimensions, Modal, Linking, Switch, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import * as Haptics from 'expo-haptics';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';
import MapView, { Marker, Polyline } from 'react-native-maps';
import Slider from '@react-native-community/slider';

const { width, height } = Dimensions.get('window');
const supabase = createClient(process.env.EXPO_PUBLIC_SUPABASE_URL, process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY);
const GAPI = process.env.EXPO_PUBLIC_GOOGLE_API_KEY;
const PRI = '#E07A5F'; // Coral/Salmon rengi
const SEC = '#3D405B'; // Koyu lacivert
const COLORS = ['#E07A5F', '#81B29A', '#F2CC8F', '#3D405B', '#F4F1DE', '#00BCD4', '#FF5722'];

const RANKS = [
  { id: 'newbie', name: { tr: 'Çaylak', en: 'Newbie' }, icon: '🌱', min: 0, max: 99 },
  { id: 'explorer', name: { tr: 'Kaşif', en: 'Explorer' }, icon: '🧭', min: 100, max: 499 },
  { id: 'traveler', name: { tr: 'Gezgin', en: 'Traveler' }, icon: '✈️', min: 500, max: 999 },
  { id: 'adventurer', name: { tr: 'Maceracı', en: 'Adventurer' }, icon: '🏔️', min: 1000, max: 2499 },
  { id: 'globetrotter', name: { tr: 'Dünya Gezgini', en: 'Globetrotter' }, icon: '🌍', min: 2500, max: 99999 },
];

const PREFS = [
  { id: 'arch', i: '🏛️', tr: 'Mimari', en: 'Architecture' },
  { id: 'night', i: '🌙', tr: 'Gece Hayatı', en: 'Nightlife' },
  { id: 'art', i: '🎭', tr: 'Sanat', en: 'Art' },
  { id: 'food', i: '🍽️', tr: 'Yemek', en: 'Food' },
  { id: 'adv', i: '🏔️', tr: 'Macera', en: 'Adventure' },
  { id: 'photo', i: '📸', tr: 'Fotoğraf', en: 'Photo' },
  { id: 'shop', i: '🛍️', tr: 'Alışveriş', en: 'Shopping' },
  { id: 'nature', i: '🌿', tr: 'Doğa', en: 'Nature' },
  { id: 'beach', i: '🏖️', tr: 'Plaj', en: 'Beach' },
  { id: 'museum', i: '🖼️', tr: 'Müze', en: 'Museum' },
  { id: 'history', i: '📜', tr: 'Tarih', en: 'History' },
  { id: 'romantic', i: '❤️', tr: 'Romantik', en: 'Romantic' },
  { id: 'family', i: '👨‍👩‍👧', tr: 'Aile', en: 'Family' },
  { id: 'budget', i: '💰', tr: 'Bütçe', en: 'Budget' },
  { id: 'luxury', i: '✨', tr: 'Lüks', en: 'Luxury' },
  { id: 'cafe', i: '☕', tr: 'Kafe', en: 'Cafe' },
  { id: 'bar', i: '🍺', tr: 'Bar', en: 'Bar' },
  { id: 'spa', i: '🧘', tr: 'Spa', en: 'Spa' },
  { id: 'sport', i: '⚽', tr: 'Spor', en: 'Sport' },
  { id: 'rel', i: '⛪', tr: 'Dini', en: 'Religious' },
  { id: 'market', i: '🏪', tr: 'Pazar', en: 'Market' },
  { id: 'view', i: '🌄', tr: 'Manzara', en: 'View' },
  { id: 'street', i: '🌮', tr: 'Sokak', en: 'Street' },
  { id: 'hidden', i: '💎', tr: 'Gizli', en: 'Hidden' },
];

const CATS = [
  { id: 'attr', i: '🏛️', tr: 'Turistik', en: 'Attraction' },
  { id: 'rest', i: '🍽️', tr: 'Restoran', en: 'Restaurant' },
  { id: 'cafe', i: '☕', tr: 'Kafe', en: 'Cafe' },
  { id: 'museum', i: '🖼️', tr: 'Müze', en: 'Museum' },
  { id: 'park', i: '🌳', tr: 'Park', en: 'Park' },
  { id: 'mall', i: '🛍️', tr: 'AVM', en: 'Mall' },
];

const CITIES = [
  { id: 'ist', n: 'Istanbul', c: 'Turkey', f: '🇹🇷', img: 'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?w=400', d: 3, lat: 41.0082, lng: 28.9784 },
  { id: 'par', n: 'Paris', c: 'France', f: '🇫🇷', img: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=400', d: 2, lat: 48.8566, lng: 2.3522 },
  { id: 'tok', n: 'Tokyo', c: 'Japan', f: '🇯🇵', img: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=400', d: 5, lat: 35.6762, lng: 139.6503 },
  { id: 'ny', n: 'New York', c: 'USA', f: '🇺🇸', img: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=400', d: 4, lat: 40.7128, lng: -74.006 },
  { id: 'lon', n: 'London', c: 'UK', f: '🇬🇧', img: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=400', d: 3, lat: 51.5074, lng: -0.1278 },
  { id: 'rom', n: 'Rome', c: 'Italy', f: '🇮🇹', img: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=400', d: 3, lat: 41.9028, lng: 12.4964 },
  { id: 'bar', n: 'Barcelona', c: 'Spain', f: '🇪🇸', img: 'https://images.unsplash.com/photo-1583422409516-2895a77efded?w=400', d: 3, lat: 41.3851, lng: 2.1734 },
  { id: 'dub', n: 'Dubai', c: 'UAE', f: '🇦🇪', img: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=400', d: 4, lat: 25.2048, lng: 55.2708 },
];

const PREBUILT_TRIPS = {
  ist: { city: 'Istanbul', flag: '🇹🇷', days: 3, lat: 41.0082, lng: 28.9784, itin: [
    { d: 1, spots: [
      { n: 'Hagia Sophia', t: 'mosque', r: 4.8, lat: 41.0086, lng: 28.9802, img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/22/Hagia_Sophia_Mars_2013.jpg/400px-Hagia_Sophia_Mars_2013.jpg', id: 'ist1' },
      { n: 'Blue Mosque', t: 'mosque', r: 4.7, lat: 41.0054, lng: 28.9768, img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c7/Blue_Mosque_Istanbul_2023.jpg/400px-Blue_Mosque_Istanbul_2023.jpg', id: 'ist2', dst: '0.4', wk: 5 },
      { n: 'Basilica Cistern', t: 'museum', r: 4.6, lat: 41.0084, lng: 28.9779, img: 'https://images.unsplash.com/photo-1527838832700-5059252407fa?w=400', id: 'ist3', dst: '0.3', wk: 4 },
      { n: 'Grand Bazaar', t: 'market', r: 4.5, lat: 41.0106, lng: 28.9680, img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5a/Grand-Bazaar_Shop.jpg/400px-Grand-Bazaar_Shop.jpg', id: 'ist4', dst: '0.8', wk: 10 },
      { n: 'Topkapi Palace', t: 'museum', r: 4.6, lat: 41.0115, lng: 28.9833, img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8f/Topkap%C4%B1_-_01.jpg/400px-Topkap%C4%B1_-_01.jpg', id: 'ist5', dst: '1.2', wk: 15 },
      { n: 'Gulhane Park', t: 'park', r: 4.4, lat: 41.0132, lng: 28.9815, img: 'https://images.unsplash.com/photo-1527838832700-5059252407fa?w=400', id: 'ist6', dst: '0.3', wk: 4 },
      { n: 'Sultanahmet Koftecisi', t: 'restaurant', r: 4.5, lat: 41.0067, lng: 28.9755, img: 'https://images.unsplash.com/photo-1529006557810-274b9b2fc783?w=400', id: 'ist7', dst: '0.5', wk: 6 },
    ]},
    { d: 2, spots: [
      { n: 'Galata Tower', t: 'tower', r: 4.6, lat: 41.0256, lng: 28.9741, img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4f/Galata_Tower_%282%29.jpg/400px-Galata_Tower_%282%29.jpg', id: 'ist8' },
      { n: 'Karakoy Lokantasi', t: 'restaurant', r: 4.5, lat: 41.0225, lng: 28.9752, img: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400', id: 'ist9', dst: '0.4', wk: 5 },
      { n: 'Istiklal Street', t: 'street', r: 4.4, lat: 41.0341, lng: 28.9770, img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0e/Istiklal_Avenue.jpg/400px-Istiklal_Avenue.jpg', id: 'ist10', dst: '1.0', wk: 12 },
      { n: 'Cicek Pasaji', t: 'market', r: 4.3, lat: 41.0328, lng: 28.9762, img: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400', id: 'ist11', dst: '0.2', wk: 3 },
      { n: 'Taksim Square', t: 'square', r: 4.3, lat: 41.0370, lng: 28.9850, img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/88/Taksim_Square.jpg/400px-Taksim_Square.jpg', id: 'ist12', dst: '0.7', wk: 9 },
      { n: 'Galata Bridge', t: 'bridge', r: 4.4, lat: 41.0202, lng: 28.9733, img: 'https://images.unsplash.com/photo-1541432901042-2d8bd64b4a9b?w=400', id: 'ist13', dst: '1.8', wk: 22 },
      { n: 'Spice Bazaar', t: 'market', r: 4.5, lat: 41.0166, lng: 28.9707, img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/fa/Spice_Bazaar_01.jpg/400px-Spice_Bazaar_01.jpg', id: 'ist14', dst: '0.4', wk: 5 },
    ]},
    { d: 3, spots: [
      { n: 'Dolmabahce Palace', t: 'palace', r: 4.7, lat: 41.0391, lng: 29.0005, img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6f/Dolmabah%C3%A7e_Palace.jpg/400px-Dolmabah%C3%A7e_Palace.jpg', id: 'ist15' },
      { n: 'Besiktas Fish Market', t: 'restaurant', r: 4.4, lat: 41.0420, lng: 29.0050, img: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=400', id: 'ist16', dst: '0.5', wk: 6 },
      { n: 'Ortakoy Square', t: 'square', r: 4.5, lat: 41.0470, lng: 29.0270, img: 'https://images.unsplash.com/photo-1527838832700-5059252407fa?w=400', id: 'ist17', dst: '2.0', wk: 25 },
      { n: 'Ortakoy Mosque', t: 'mosque', r: 4.6, lat: 41.0472, lng: 29.0276, img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/90/Ortak%C3%B6y_Mosque.jpg/400px-Ortak%C3%B6y_Mosque.jpg', id: 'ist18', dst: '0.1', wk: 1 },
      { n: 'Kumpir Street', t: 'food', r: 4.3, lat: 41.0475, lng: 29.0280, img: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400', id: 'ist19', dst: '0.1', wk: 1 },
      { n: 'Bosphorus Cruise', t: 'cruise', r: 4.8, lat: 41.0300, lng: 29.0100, img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2f/Bosphorus_Bridge.jpg/400px-Bosphorus_Bridge.jpg', id: 'ist20', dst: '1.5', wk: 18 },
      { n: 'Bebek Park', t: 'park', r: 4.5, lat: 41.0765, lng: 29.0437, img: 'https://images.unsplash.com/photo-1519331379826-f10be5486c6f?w=400', id: 'ist21', dst: '3.5', wk: 15 },
    ]}
  ]},
  par: { city: 'Paris', flag: '🇫🇷', days: 2, lat: 48.8566, lng: 2.3522, itin: [
    { d: 1, spots: [
      { n: 'Eiffel Tower', t: 'landmark', r: 4.7, lat: 48.8584, lng: 2.2945, img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a8/Tour_Eiffel_Wikimedia_Commons.jpg/400px-Tour_Eiffel_Wikimedia_Commons.jpg', id: 'par1' },
      { n: 'Trocadero', t: 'viewpoint', r: 4.6, lat: 48.8616, lng: 2.2892, img: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=400', id: 'par2', dst: '0.4', wk: 5 },
      { n: 'Arc de Triomphe', t: 'monument', r: 4.7, lat: 48.8738, lng: 2.2950, img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/79/Arc_de_Triomphe%2C_Paris_21_October_2010.jpg/400px-Arc_de_Triomphe%2C_Paris_21_October_2010.jpg', id: 'par3', dst: '2.5', wk: 20 },
      { n: 'Champs-Elysees', t: 'street', r: 4.5, lat: 48.8698, lng: 2.3075, img: 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=400', id: 'par4', dst: '1.0', wk: 12 },
      { n: 'Place de la Concorde', t: 'square', r: 4.4, lat: 48.8656, lng: 2.3212, img: 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=400', id: 'par5', dst: '1.2', wk: 15 },
      { n: 'Cafe de Flore', t: 'cafe', r: 4.4, lat: 48.8541, lng: 2.3326, img: 'https://images.unsplash.com/photo-1559925393-8be0ec4767c8?w=400', id: 'par6', dst: '1.5', wk: 18 },
      { n: 'Pont Alexandre III', t: 'bridge', r: 4.6, lat: 48.8637, lng: 2.3136, img: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=400', id: 'par7', dst: '1.8', wk: 22 },
    ]},
    { d: 2, spots: [
      { n: 'Louvre Museum', t: 'museum', r: 4.8, lat: 48.8606, lng: 2.3376, img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/66/Louvre_Museum_Wikimedia_Commons.jpg/400px-Louvre_Museum_Wikimedia_Commons.jpg', id: 'par8' },
      { n: 'Jardin des Tuileries', t: 'park', r: 4.5, lat: 48.8634, lng: 2.3275, img: 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=400', id: 'par9', dst: '0.8', wk: 10 },
      { n: 'Notre-Dame', t: 'cathedral', r: 4.7, lat: 48.8530, lng: 2.3499, img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f7/Notre-Dame_de_Paris%2C_4_October_2017.jpg/400px-Notre-Dame_de_Paris%2C_4_October_2017.jpg', id: 'par10', dst: '1.2', wk: 15 },
      { n: 'Shakespeare and Co', t: 'bookstore', r: 4.6, lat: 48.8526, lng: 2.3472, img: 'https://images.unsplash.com/photo-1568667256549-094345857637?w=400', id: 'par11', dst: '0.2', wk: 3 },
      { n: 'Latin Quarter', t: 'district', r: 4.4, lat: 48.8497, lng: 2.3446, img: 'https://images.unsplash.com/photo-1500039436846-25ae2f11882e?w=400', id: 'par12', dst: '0.4', wk: 5 },
      { n: 'Sacre-Coeur', t: 'basilica', r: 4.6, lat: 48.8867, lng: 2.3431, img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/Le_sacre_coeur.jpg/400px-Le_sacre_coeur.jpg', id: 'par13', dst: '4.0', wk: 20 },
      { n: 'Montmartre', t: 'district', r: 4.5, lat: 48.8867, lng: 2.3406, img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ab/Montmartre_Place_du_Tertre.jpg/400px-Montmartre_Place_du_Tertre.jpg', id: 'par14', dst: '0.3', wk: 4 },
    ]}
  ]},
  tok: { city: 'Tokyo', flag: '🇯🇵', days: 3, lat: 35.6762, lng: 139.6503, itin: [
    { d: 1, spots: [
      { n: 'Senso-ji Temple', t: 'temple', r: 4.6, lat: 35.7148, lng: 139.7967, img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/75/Cloudy_Sensoji.jpg/400px-Cloudy_Sensoji.jpg', id: 'tok1' },
      { n: 'Nakamise Street', t: 'street', r: 4.4, lat: 35.7118, lng: 139.7963, img: 'https://images.unsplash.com/photo-1545569341-9eb8b30979d9?w=400', id: 'tok2', dst: '0.3', wk: 4 },
      { n: 'Tokyo Skytree', t: 'tower', r: 4.5, lat: 35.7101, lng: 139.8107, img: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=400', id: 'tok3', dst: '1.5', wk: 18 },
      { n: 'Ueno Park', t: 'park', r: 4.5, lat: 35.7146, lng: 139.7732, img: 'https://images.unsplash.com/photo-1545569341-9eb8b30979d9?w=400', id: 'tok4', dst: '2.5', wk: 20 },
      { n: 'Ameyoko Market', t: 'market', r: 4.4, lat: 35.7085, lng: 139.7748, img: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=400', id: 'tok5', dst: '0.7', wk: 9 },
      { n: 'Ichiran Ramen', t: 'restaurant', r: 4.6, lat: 35.7100, lng: 139.7750, img: 'https://images.unsplash.com/photo-1557872943-16a5ac26437e?w=400', id: 'tok6', dst: '0.2', wk: 3 },
      { n: 'Akihabara', t: 'district', r: 4.4, lat: 35.7023, lng: 139.7745, img: 'https://images.unsplash.com/photo-1542051841857-5f90071e7989?w=400', id: 'tok7', dst: '0.8', wk: 10 },
    ]},
    { d: 2, spots: [
      { n: 'Shibuya Crossing', t: 'landmark', r: 4.5, lat: 35.6595, lng: 139.7004, img: 'https://images.unsplash.com/photo-1542051841857-5f90071e7989?w=400', id: 'tok8' },
      { n: 'Hachiko Statue', t: 'monument', r: 4.4, lat: 35.6590, lng: 139.7006, img: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=400', id: 'tok9', dst: '0.1', wk: 1 },
      { n: 'Shibuya Sky', t: 'viewpoint', r: 4.6, lat: 35.6584, lng: 139.7022, img: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=400', id: 'tok10', dst: '0.3', wk: 4 },
      { n: 'Meiji Shrine', t: 'shrine', r: 4.7, lat: 35.6764, lng: 139.6993, img: 'https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=400', id: 'tok11', dst: '2.0', wk: 25 },
      { n: 'Harajuku', t: 'district', r: 4.5, lat: 35.6702, lng: 139.7027, img: 'https://images.unsplash.com/photo-1542051841857-5f90071e7989?w=400', id: 'tok12', dst: '0.6', wk: 8 },
      { n: 'Takeshita Street', t: 'street', r: 4.4, lat: 35.6716, lng: 139.7031, img: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=400', id: 'tok13', dst: '0.2', wk: 3 },
      { n: 'Omotesando', t: 'street', r: 4.5, lat: 35.6654, lng: 139.7121, img: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=400', id: 'tok14', dst: '0.8', wk: 10 },
    ]},
    { d: 3, spots: [
      { n: 'Tsukiji Market', t: 'market', r: 4.4, lat: 35.6654, lng: 139.7707, img: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=400', id: 'tok15' },
      { n: 'Ginza', t: 'district', r: 4.5, lat: 35.6717, lng: 139.7649, img: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=400', id: 'tok16', dst: '1.0', wk: 12 },
      { n: 'Imperial Palace', t: 'palace', r: 4.5, lat: 35.6852, lng: 139.7528, img: 'https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=400', id: 'tok17', dst: '1.2', wk: 15 },
      { n: 'Tokyo Station', t: 'station', r: 4.3, lat: 35.6812, lng: 139.7671, img: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=400', id: 'tok18', dst: '0.8', wk: 10 },
      { n: 'teamLab Planets', t: 'museum', r: 4.7, lat: 35.6504, lng: 139.7874, img: 'https://images.unsplash.com/photo-1490806843957-31f4c9a91c65?w=400', id: 'tok19', dst: '3.5', wk: 20 },
      { n: 'Odaiba', t: 'island', r: 4.4, lat: 35.6289, lng: 139.7745, img: 'https://images.unsplash.com/photo-1490806843957-31f4c9a91c65?w=400', id: 'tok20', dst: '2.5', wk: 20 },
      { n: 'Rainbow Bridge', t: 'bridge', r: 4.3, lat: 35.6367, lng: 139.7632, img: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=400', id: 'tok21', dst: '1.0', wk: 12 },
    ]}
  ]},
  ny: { city: 'New York', flag: '🇺🇸', days: 3, lat: 40.7128, lng: -74.006, itin: [
    { d: 1, spots: [
      { n: 'Statue of Liberty', t: 'monument', r: 4.7, lat: 40.6892, lng: -74.0445, img: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=400', id: 'ny1' },
      { n: 'Ellis Island', t: 'museum', r: 4.6, lat: 40.6995, lng: -74.0396, img: 'https://images.unsplash.com/photo-1534430480872-3498386e7856?w=400', id: 'ny2', dst: '0.5', wk: 6 },
      { n: 'Battery Park', t: 'park', r: 4.4, lat: 40.7033, lng: -74.0170, img: 'https://images.unsplash.com/photo-1534430480872-3498386e7856?w=400', id: 'ny3', dst: '1.5', wk: 18 },
      { n: 'Wall Street', t: 'street', r: 4.3, lat: 40.7074, lng: -74.0113, img: 'https://images.unsplash.com/photo-1534430480872-3498386e7856?w=400', id: 'ny4', dst: '0.5', wk: 6 },
      { n: '9/11 Memorial', t: 'memorial', r: 4.8, lat: 40.7115, lng: -74.0134, img: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=400', id: 'ny5', dst: '0.5', wk: 6 },
      { n: 'One World Trade', t: 'building', r: 4.6, lat: 40.7127, lng: -74.0134, img: 'https://images.unsplash.com/photo-1534430480872-3498386e7856?w=400', id: 'ny6', dst: '0.1', wk: 1 },
      { n: 'Brooklyn Bridge', t: 'bridge', r: 4.8, lat: 40.7061, lng: -73.9969, img: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=400', id: 'ny7', dst: '1.5', wk: 18 },
    ]},
    { d: 2, spots: [
      { n: 'Central Park', t: 'park', r: 4.8, lat: 40.7829, lng: -73.9654, img: 'https://images.unsplash.com/photo-1534430480872-3498386e7856?w=400', id: 'ny8' },
      { n: 'MET Museum', t: 'museum', r: 4.8, lat: 40.7794, lng: -73.9632, img: 'https://images.unsplash.com/photo-1534430480872-3498386e7856?w=400', id: 'ny9', dst: '0.5', wk: 6 },
      { n: 'Bethesda Fountain', t: 'fountain', r: 4.5, lat: 40.7741, lng: -73.9708, img: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=400', id: 'ny10', dst: '0.8', wk: 10 },
      { n: 'Guggenheim', t: 'museum', r: 4.6, lat: 40.7830, lng: -73.9590, img: 'https://images.unsplash.com/photo-1534430480872-3498386e7856?w=400', id: 'ny11', dst: '0.4', wk: 5 },
      { n: 'Fifth Avenue', t: 'street', r: 4.5, lat: 40.7748, lng: -73.9654, img: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=400', id: 'ny12', dst: '0.9', wk: 11 },
      { n: 'Shake Shack', t: 'restaurant', r: 4.4, lat: 40.7785, lng: -73.9665, img: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400', id: 'ny13', dst: '0.4', wk: 5 },
      { n: 'Strawberry Fields', t: 'memorial', r: 4.4, lat: 40.7757, lng: -73.9751, img: 'https://images.unsplash.com/photo-1534430480872-3498386e7856?w=400', id: 'ny14', dst: '0.8', wk: 10 },
    ]},
    { d: 3, spots: [
      { n: 'Empire State', t: 'building', r: 4.7, lat: 40.7484, lng: -73.9857, img: 'https://images.unsplash.com/photo-1534430480872-3498386e7856?w=400', id: 'ny15' },
      { n: 'Times Square', t: 'square', r: 4.5, lat: 40.7580, lng: -73.9855, img: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=400', id: 'ny16', dst: '1.0', wk: 12 },
      { n: 'Broadway', t: 'theater', r: 4.6, lat: 40.7590, lng: -73.9845, img: 'https://images.unsplash.com/photo-1534430480872-3498386e7856?w=400', id: 'ny17', dst: '0.1', wk: 2 },
      { n: 'Grand Central', t: 'station', r: 4.6, lat: 40.7527, lng: -73.9772, img: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=400', id: 'ny18', dst: '0.8', wk: 10 },
      { n: 'Rockefeller Center', t: 'complex', r: 4.6, lat: 40.7587, lng: -73.9787, img: 'https://images.unsplash.com/photo-1534430480872-3498386e7856?w=400', id: 'ny19', dst: '0.6', wk: 8 },
      { n: 'Top of the Rock', t: 'viewpoint', r: 4.7, lat: 40.7593, lng: -73.9794, img: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=400', id: 'ny20', dst: '0.1', wk: 1 },
      { n: 'Katzs Deli', t: 'restaurant', r: 4.5, lat: 40.7223, lng: -73.9874, img: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400', id: 'ny21', dst: '4.5', wk: 20 },
    ]}
  ]},
  lon: { city: 'London', flag: '🇬🇧', days: 3, lat: 51.5074, lng: -0.1278, itin: [
    { d: 1, spots: [
      { n: 'Big Ben', t: 'landmark', r: 4.7, lat: 51.5007, lng: -0.1246, img: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=400', id: 'lon1' },
      { n: 'Westminster Abbey', t: 'church', r: 4.7, lat: 51.4994, lng: -0.1273, img: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=400', id: 'lon2', dst: '0.2', wk: 3 },
      { n: 'London Eye', t: 'attraction', r: 4.5, lat: 51.5033, lng: -0.1196, img: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=400', id: 'lon3', dst: '0.5', wk: 6 },
      { n: 'Southbank', t: 'promenade', r: 4.4, lat: 51.5055, lng: -0.1169, img: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=400', id: 'lon4', dst: '0.3', wk: 4 },
      { n: 'Borough Market', t: 'market', r: 4.6, lat: 51.5055, lng: -0.0910, img: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400', id: 'lon5', dst: '2.0', wk: 25 },
      { n: 'St Pauls Cathedral', t: 'cathedral', r: 4.7, lat: 51.5138, lng: -0.0984, img: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=400', id: 'lon6', dst: '0.9', wk: 11 },
      { n: 'Millennium Bridge', t: 'bridge', r: 4.4, lat: 51.5095, lng: -0.0985, img: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=400', id: 'lon7', dst: '0.5', wk: 6 },
    ]},
    { d: 2, spots: [
      { n: 'Buckingham Palace', t: 'palace', r: 4.6, lat: 51.5014, lng: -0.1419, img: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=400', id: 'lon8' },
      { n: 'St. James Park', t: 'park', r: 4.5, lat: 51.5025, lng: -0.1348, img: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=400', id: 'lon9', dst: '0.5', wk: 6 },
      { n: 'Trafalgar Square', t: 'square', r: 4.5, lat: 51.5080, lng: -0.1281, img: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=400', id: 'lon10', dst: '0.8', wk: 10 },
      { n: 'National Gallery', t: 'museum', r: 4.7, lat: 51.5089, lng: -0.1283, img: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=400', id: 'lon11', dst: '0.1', wk: 1 },
      { n: 'Covent Garden', t: 'market', r: 4.5, lat: 51.5117, lng: -0.1240, img: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=400', id: 'lon12', dst: '0.5', wk: 6 },
      { n: 'Leicester Square', t: 'square', r: 4.3, lat: 51.5103, lng: -0.1301, img: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=400', id: 'lon13', dst: '0.4', wk: 5 },
      { n: 'Dishoom', t: 'restaurant', r: 4.6, lat: 51.5115, lng: -0.1235, img: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400', id: 'lon14', dst: '0.2', wk: 3 },
    ]},
    { d: 3, spots: [
      { n: 'British Museum', t: 'museum', r: 4.8, lat: 51.5194, lng: -0.1270, img: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=400', id: 'lon15' },
      { n: 'Kings Cross', t: 'station', r: 4.3, lat: 51.5309, lng: -0.1233, img: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=400', id: 'lon16', dst: '1.3', wk: 16 },
      { n: 'Tower of London', t: 'castle', r: 4.7, lat: 51.5081, lng: -0.0759, img: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=400', id: 'lon17', dst: '3.5', wk: 20 },
      { n: 'Tower Bridge', t: 'bridge', r: 4.7, lat: 51.5055, lng: -0.0754, img: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=400', id: 'lon18', dst: '0.3', wk: 4 },
      { n: 'Sky Garden', t: 'viewpoint', r: 4.5, lat: 51.5113, lng: -0.0836, img: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=400', id: 'lon19', dst: '0.7', wk: 9 },
      { n: 'The Shard', t: 'building', r: 4.5, lat: 51.5045, lng: -0.0865, img: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=400', id: 'lon20', dst: '0.7', wk: 9 },
      { n: 'Camden Market', t: 'market', r: 4.4, lat: 51.5415, lng: -0.1463, img: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400', id: 'lon21', dst: '5.5', wk: 25 },
    ]}
  ]},
  rom: { city: 'Rome', flag: '🇮🇹', days: 3, lat: 41.9028, lng: 12.4964, itin: [
    { d: 1, spots: [
      { n: 'Colosseum', t: 'landmark', r: 4.8, lat: 41.8902, lng: 12.4922, img: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=400', id: 'rom1' },
      { n: 'Roman Forum', t: 'ruins', r: 4.7, lat: 41.8925, lng: 12.4853, img: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=400', id: 'rom2', dst: '0.5', wk: 6 },
      { n: 'Palatine Hill', t: 'ruins', r: 4.6, lat: 41.8893, lng: 12.4875, img: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=400', id: 'rom3', dst: '0.3', wk: 4 },
      { n: 'Circus Maximus', t: 'ruins', r: 4.3, lat: 41.8860, lng: 12.4853, img: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=400', id: 'rom4', dst: '0.4', wk: 5 },
      { n: 'Mouth of Truth', t: 'monument', r: 4.4, lat: 41.8879, lng: 12.4816, img: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=400', id: 'rom5', dst: '0.4', wk: 5 },
      { n: 'Capitoline Museums', t: 'museum', r: 4.6, lat: 41.8930, lng: 12.4829, img: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=400', id: 'rom6', dst: '0.5', wk: 6 },
      { n: 'Luzzi Trattoria', t: 'restaurant', r: 4.4, lat: 41.8892, lng: 12.4962, img: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400', id: 'rom7', dst: '1.0', wk: 12 },
    ]},
    { d: 2, spots: [
      { n: 'Vatican Museums', t: 'museum', r: 4.8, lat: 41.9065, lng: 12.4536, img: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=400', id: 'rom8' },
      { n: 'Sistine Chapel', t: 'chapel', r: 4.9, lat: 41.9029, lng: 12.4545, img: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=400', id: 'rom9', dst: '0.2', wk: 3 },
      { n: 'St. Peters Basilica', t: 'church', r: 4.8, lat: 41.9022, lng: 12.4539, img: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=400', id: 'rom10', dst: '0.2', wk: 3 },
      { n: 'St. Peters Square', t: 'square', r: 4.7, lat: 41.9022, lng: 12.4567, img: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=400', id: 'rom11', dst: '0.2', wk: 3 },
      { n: 'Castel SantAngelo', t: 'castle', r: 4.5, lat: 41.9031, lng: 12.4663, img: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=400', id: 'rom12', dst: '0.9', wk: 11 },
      { n: 'Piazza Navona', t: 'square', r: 4.6, lat: 41.8992, lng: 12.4730, img: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=400', id: 'rom13', dst: '0.6', wk: 8 },
      { n: 'Armando al Pantheon', t: 'restaurant', r: 4.6, lat: 41.8987, lng: 12.4767, img: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400', id: 'rom14', dst: '0.4', wk: 5 },
    ]},
    { d: 3, spots: [
      { n: 'Trevi Fountain', t: 'fountain', r: 4.7, lat: 41.9009, lng: 12.4833, img: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=400', id: 'rom15' },
      { n: 'Spanish Steps', t: 'landmark', r: 4.6, lat: 41.9058, lng: 12.4823, img: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=400', id: 'rom16', dst: '0.6', wk: 8 },
      { n: 'Villa Borghese', t: 'park', r: 4.5, lat: 41.9145, lng: 12.4919, img: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=400', id: 'rom17', dst: '1.2', wk: 15 },
      { n: 'Borghese Gallery', t: 'museum', r: 4.8, lat: 41.9142, lng: 12.4921, img: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=400', id: 'rom18', dst: '0.1', wk: 1 },
      { n: 'Pantheon', t: 'temple', r: 4.8, lat: 41.8986, lng: 12.4769, img: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=400', id: 'rom19', dst: '1.8', wk: 22 },
      { n: 'Campo de Fiori', t: 'square', r: 4.4, lat: 41.8956, lng: 12.4722, img: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=400', id: 'rom20', dst: '0.4', wk: 5 },
      { n: 'Giolitti Gelato', t: 'gelato', r: 4.5, lat: 41.8997, lng: 12.4780, img: 'https://images.unsplash.com/photo-1567206563064-6f60f40a2b57?w=400', id: 'rom21', dst: '0.6', wk: 8 },
    ]}
  ]},
  bar: { city: 'Barcelona', flag: '🇪🇸', days: 3, lat: 41.3851, lng: 2.1734, itin: [
    { d: 1, spots: [
      { n: 'Sagrada Familia', t: 'basilica', r: 4.8, lat: 41.4036, lng: 2.1744, img: 'https://images.unsplash.com/photo-1583422409516-2895a77efded?w=400', id: 'bar1' },
      { n: 'Hospital Sant Pau', t: 'museum', r: 4.5, lat: 41.4116, lng: 2.1746, img: 'https://images.unsplash.com/photo-1583422409516-2895a77efded?w=400', id: 'bar2', dst: '0.9', wk: 11 },
      { n: 'Casa Mila', t: 'building', r: 4.6, lat: 41.3953, lng: 2.1619, img: 'https://images.unsplash.com/photo-1583422409516-2895a77efded?w=400', id: 'bar3', dst: '1.7', wk: 21 },
      { n: 'Casa Batllo', t: 'building', r: 4.7, lat: 41.3917, lng: 2.1650, img: 'https://images.unsplash.com/photo-1583422409516-2895a77efded?w=400', id: 'bar4', dst: '0.4', wk: 5 },
      { n: 'Passeig de Gracia', t: 'street', r: 4.5, lat: 41.3930, lng: 2.1646, img: 'https://images.unsplash.com/photo-1583422409516-2895a77efded?w=400', id: 'bar5', dst: '0.2', wk: 3 },
      { n: 'Casa Amatller', t: 'building', r: 4.4, lat: 41.3915, lng: 2.1648, img: 'https://images.unsplash.com/photo-1583422409516-2895a77efded?w=400', id: 'bar6', dst: '0.2', wk: 3 },
      { n: 'La Paradeta', t: 'restaurant', r: 4.4, lat: 41.3965, lng: 2.1746, img: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=400', id: 'bar7', dst: '0.8', wk: 10 },
    ]},
    { d: 2, spots: [
      { n: 'Park Guell', t: 'park', r: 4.6, lat: 41.4145, lng: 2.1527, img: 'https://images.unsplash.com/photo-1583422409516-2895a77efded?w=400', id: 'bar8' },
      { n: 'Bunkers del Carmel', t: 'viewpoint', r: 4.7, lat: 41.4184, lng: 2.1618, img: 'https://images.unsplash.com/photo-1583422409516-2895a77efded?w=400', id: 'bar9', dst: '1.0', wk: 12 },
      { n: 'Gothic Quarter', t: 'district', r: 4.5, lat: 41.3833, lng: 2.1777, img: 'https://images.unsplash.com/photo-1583422409516-2895a77efded?w=400', id: 'bar10', dst: '4.0', wk: 20 },
      { n: 'Barcelona Cathedral', t: 'cathedral', r: 4.6, lat: 41.3840, lng: 2.1763, img: 'https://images.unsplash.com/photo-1583422409516-2895a77efded?w=400', id: 'bar11', dst: '0.2', wk: 3 },
      { n: 'Placa Reial', t: 'square', r: 4.4, lat: 41.3797, lng: 2.1755, img: 'https://images.unsplash.com/photo-1583422409516-2895a77efded?w=400', id: 'bar12', dst: '0.5', wk: 6 },
      { n: 'El Born', t: 'district', r: 4.5, lat: 41.3850, lng: 2.1833, img: 'https://images.unsplash.com/photo-1583422409516-2895a77efded?w=400', id: 'bar13', dst: '0.7', wk: 9 },
      { n: 'Can Culleretes', t: 'restaurant', r: 4.4, lat: 41.3810, lng: 2.1758, img: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400', id: 'bar14', dst: '0.5', wk: 6 },
    ]},
    { d: 3, spots: [
      { n: 'La Rambla', t: 'street', r: 4.4, lat: 41.3797, lng: 2.1734, img: 'https://images.unsplash.com/photo-1583422409516-2895a77efded?w=400', id: 'bar15' },
      { n: 'Boqueria Market', t: 'market', r: 4.5, lat: 41.3816, lng: 2.1719, img: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400', id: 'bar16', dst: '0.2', wk: 3 },
      { n: 'Liceu Opera', t: 'theater', r: 4.5, lat: 41.3803, lng: 2.1733, img: 'https://images.unsplash.com/photo-1583422409516-2895a77efded?w=400', id: 'bar17', dst: '0.2', wk: 3 },
      { n: 'Port Vell', t: 'harbor', r: 4.4, lat: 41.3757, lng: 2.1792, img: 'https://images.unsplash.com/photo-1583422409516-2895a77efded?w=400', id: 'bar18', dst: '0.6', wk: 8 },
      { n: 'Barceloneta Beach', t: 'beach', r: 4.4, lat: 41.3784, lng: 2.1925, img: 'https://images.unsplash.com/photo-1583422409516-2895a77efded?w=400', id: 'bar19', dst: '1.2', wk: 15 },
      { n: 'W Hotel', t: 'landmark', r: 4.3, lat: 41.3687, lng: 2.1923, img: 'https://images.unsplash.com/photo-1583422409516-2895a77efded?w=400', id: 'bar20', dst: '1.1', wk: 14 },
      { n: 'La Mar Salada', t: 'restaurant', r: 4.5, lat: 41.3782, lng: 2.1890, img: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=400', id: 'bar21', dst: '1.0', wk: 12 },
    ]}
  ]},
  dub: { city: 'Dubai', flag: '🇦🇪', days: 3, lat: 25.2048, lng: 55.2708, itin: [
    { d: 1, spots: [
      { n: 'Burj Khalifa', t: 'building', r: 4.7, lat: 25.1972, lng: 55.2744, img: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=400', id: 'dub1' },
      { n: 'At The Top', t: 'viewpoint', r: 4.6, lat: 25.1972, lng: 55.2745, img: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=400', id: 'dub2', dst: '0.1', wk: 1 },
      { n: 'Dubai Mall', t: 'mall', r: 4.6, lat: 25.1985, lng: 55.2796, img: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=400', id: 'dub3', dst: '0.5', wk: 6 },
      { n: 'Dubai Aquarium', t: 'aquarium', r: 4.5, lat: 25.1988, lng: 55.2788, img: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=400', id: 'dub4', dst: '0.1', wk: 1 },
      { n: 'Dubai Fountain', t: 'fountain', r: 4.7, lat: 25.1958, lng: 55.2750, img: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=400', id: 'dub5', dst: '0.4', wk: 5 },
      { n: 'Souk Al Bahar', t: 'market', r: 4.4, lat: 25.1946, lng: 55.2728, img: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=400', id: 'dub6', dst: '0.3', wk: 4 },
      { n: 'Cheesecake Factory', t: 'restaurant', r: 4.3, lat: 25.1980, lng: 55.2790, img: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400', id: 'dub7', dst: '0.4', wk: 5 },
    ]},
    { d: 2, spots: [
      { n: 'Dubai Frame', t: 'landmark', r: 4.5, lat: 25.2350, lng: 55.3004, img: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=400', id: 'dub8' },
      { n: 'Dubai Museum', t: 'museum', r: 4.3, lat: 25.2635, lng: 55.2973, img: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=400', id: 'dub9', dst: '3.2', wk: 15 },
      { n: 'Al Fahidi', t: 'district', r: 4.4, lat: 25.2637, lng: 55.2979, img: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=400', id: 'dub10', dst: '0.1', wk: 1 },
      { n: 'Gold Souk', t: 'market', r: 4.4, lat: 25.2864, lng: 55.2971, img: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=400', id: 'dub11', dst: '2.5', wk: 20 },
      { n: 'Spice Souk', t: 'market', r: 4.3, lat: 25.2688, lng: 55.3007, img: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=400', id: 'dub12', dst: '2.0', wk: 15 },
      { n: 'Abra Ride', t: 'boat', r: 4.5, lat: 25.2651, lng: 55.2970, img: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=400', id: 'dub13', dst: '0.4', wk: 5 },
      { n: 'Arabian Tea House', t: 'cafe', r: 4.5, lat: 25.2638, lng: 55.2980, img: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400', id: 'dub14', dst: '0.5', wk: 6 },
    ]},
    { d: 3, spots: [
      { n: 'Palm Jumeirah', t: 'island', r: 4.6, lat: 25.1124, lng: 55.1390, img: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=400', id: 'dub15' },
      { n: 'Atlantis Hotel', t: 'hotel', r: 4.5, lat: 25.1304, lng: 55.1172, img: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=400', id: 'dub16', dst: '3.0', wk: 15 },
      { n: 'Aquaventure', t: 'waterpark', r: 4.6, lat: 25.1310, lng: 55.1175, img: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=400', id: 'dub17', dst: '0.1', wk: 2 },
      { n: 'Dubai Marina', t: 'district', r: 4.5, lat: 25.0805, lng: 55.1403, img: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=400', id: 'dub18', dst: '6.0', wk: 25 },
      { n: 'JBR Beach', t: 'beach', r: 4.5, lat: 25.0765, lng: 55.1330, img: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=400', id: 'dub19', dst: '0.6', wk: 8 },
      { n: 'Ain Dubai', t: 'attraction', r: 4.4, lat: 25.0796, lng: 55.1260, img: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=400', id: 'dub20', dst: '0.8', wk: 10 },
      { n: 'Pier 7', t: 'restaurant', r: 4.4, lat: 25.0768, lng: 55.1350, img: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400', id: 'dub21', dst: '0.9', wk: 11 },
    ]}
  ]}
};

const dist = (a, b, c, d) => (6371 * 2 * Math.atan2(Math.sqrt(Math.sin((c-a)*Math.PI/360)**2+Math.cos(a*Math.PI/180)*Math.cos(c*Math.PI/180)*Math.sin((d-b)*Math.PI/360)**2), Math.sqrt(1-(Math.sin((c-a)*Math.PI/360)**2+Math.cos(a*Math.PI/180)*Math.cos(c*Math.PI/180)*Math.sin((d-b)*Math.PI/360)**2)))).toFixed(1);
const walk = d => Math.round(d/0.08);

// Global foto cache - uygulama boyunca kalıcı
const photoCache = {};

// Şehir kartları için fotoğraf component'i
const CityPhoto = ({ cityName, countryName, fallbackImg, style }) => {
  const [photoUrl, setPhotoUrl] = useState(fallbackImg);
  const [loading, setLoading] = useState(true);
  
  const cacheKey = `city_${cityName}_${countryName}`.toLowerCase().replace(/\s+/g, '_');
  
  useEffect(() => {
    // Cache'de varsa direkt kullan
    if (photoCache[cacheKey]) {
      setPhotoUrl(photoCache[cacheKey]);
      setLoading(false);
      return;
    }
    
    const fetchPhoto = async () => {
      try {
        const query = `${cityName} ${countryName} skyline landmark`;
        const searchUrl = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(query)}&key=${GAPI}`;
        const res = await fetch(searchUrl);
        const data = await res.json();
        
        if (data.results?.[0]?.photos?.[0]?.photo_reference) {
          const photoRef = data.results[0].photos[0].photo_reference;
          const url = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photo_reference=${photoRef}&key=${GAPI}`;
          photoCache[cacheKey] = url;
          setPhotoUrl(url);
        }
      } catch (e) {
        console.log('City photo error:', e);
      } finally {
        setLoading(false);
      }
    };
    
    fetchPhoto();
  }, [cityName, countryName, cacheKey]);
  
  return <Image source={{ uri: photoUrl }} style={style} />;
};

// Mekan ismi + şehir ile Google'dan fotoğraf çeken component
const PlacePhoto = ({ placeName, cityName, fallbackImg, style }) => {
  const [photoUrl, setPhotoUrl] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  
  const cacheKey = `${placeName}_${cityName}`.toLowerCase().replace(/\s+/g, '_');
  
  useEffect(() => {
    if (!placeName) {
      setLoading(false);
      return;
    }
    
    // Cache'de varsa direkt kullan
    if (photoCache[cacheKey]) {
      setPhotoUrl(photoCache[cacheKey]);
      setLoading(false);
      return;
    }
    
    const fetchPhoto = async () => {
      try {
        // Text Search API ile mekanı ara
        const query = `${placeName} ${cityName || ''}`.trim();
        const searchUrl = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(query)}&key=${GAPI}`;
        const res = await fetch(searchUrl);
        const data = await res.json();
        
        if (data.results?.[0]?.photos?.[0]?.photo_reference) {
          const photoRef = data.results[0].photos[0].photo_reference;
          const url = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photo_reference=${photoRef}&key=${GAPI}`;
          
          // Cache'e kaydet
          photoCache[cacheKey] = url;
          setPhotoUrl(url);
        } else {
          setError(true);
        }
      } catch (e) {
        console.log('Photo fetch error:', e);
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    
    fetchPhoto();
  }, [placeName, cityName, cacheKey]);
  
  if (loading) {
    return (
      <View style={[style, { backgroundColor: '#1a2a3a', justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="small" color={PRI} />
      </View>
    );
  }
  
  if (photoUrl) {
    return <Image source={{ uri: photoUrl }} style={style} />;
  }
  
  if (fallbackImg && !error) {
    return <Image source={{ uri: fallbackImg }} style={style} onError={() => setError(true)} />;
  }
  
  // Fallback: mekan tipine göre emoji
  return (
    <View style={[style, { backgroundColor: '#1a2a3a', justifyContent: 'center', alignItems: 'center' }]}>
      <Text style={{ fontSize: 32 }}>📍</Text>
    </View>
  );
};

// Ülke kodundan bayrak emoji oluştur (US -> 🇺🇸)
const getFlag = (code) => {
  if (!code || code.length !== 2) return '🌍';
  const codePoints = code.toUpperCase().split('').map(c => 127397 + c.charCodeAt(0));
  return String.fromCodePoint(...codePoints);
};

// Normal buton - sadece scale animasyonu
const Btn = ({ onPress, style, children, disabled }) => {
  const [p, setP] = useState(false);
  return (
    <TouchableOpacity 
      onPress={onPress} 
      onPressIn={() => setP(true)} 
      onPressOut={() => setP(false)} 
      style={[style, { transform: [{ scale: p ? 0.97 : 1 }] }]} 
      disabled={disabled} 
      activeOpacity={0.9}
    >
      {children}
    </TouchableOpacity>
  );
};

// Haptic buton - önemli işlemler için (kaydet, sil, oluştur)
const HapticBtn = ({ onPress, style, children, disabled, type = 'light' }) => {
  const [p, setP] = useState(false);
  const handlePress = () => {
    if (type === 'success') Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    else if (type === 'warning') Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    else if (type === 'error') Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    else Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPress && onPress();
  };
  return (
    <TouchableOpacity 
      onPress={handlePress} 
      onPressIn={() => setP(true)} 
      onPressOut={() => setP(false)} 
      style={[style, { transform: [{ scale: p ? 0.95 : 1 }] }]} 
      disabled={disabled} 
      activeOpacity={0.85}
    >
      {children}
    </TouchableOpacity>
  );
};

export default function App() {
  const [u, setU] = useState(null);
  const [ld, setLd] = useState(true);
  const [am, setAm] = useState('login');
  const [em, setEm] = useState('');
  const [pw, setPw] = useState('');
  const [nm, setNm] = useState('');
  const [al, setAl] = useState(false);
  const [rm, setRm] = useState(false);
  const [scr, setScr] = useState('home');
  const [pts, setPts] = useState(0);
  const [trips, setTrips] = useState([]);
  const [pro, setPro] = useState(true);
  const [cityM, setCityM] = useState(false);
  const [dayM, setDayM] = useState(false);
  const [planM, setPlanM] = useState(false);
  const [prefM, setPrefM] = useState(false);
  const [manM, setManM] = useState(false);
  const [proM, setProM] = useState(false);
  const [profM, setProfM] = useState(false);
  const [delM, setDelM] = useState(false);
  const [delT, setDelT] = useState(null);
  const [fabM, setFabM] = useState(false); // FAB menu modal
  const [cq, setCq] = useState('');
  const [cr, setCr] = useState([]);
  const [cl, setCl] = useState(false);
  const [city, setCity] = useState(null);
  const [days, setDays] = useState(3);
  const [prf, setPrf] = useState([]);
  const [gen, setGen] = useState(false);
  const [spots, setSpots] = useState([]);
  const [cat, setCat] = useState(null);
  const [catP, setCatP] = useState([]);
  const [catL, setCatL] = useState(false);
  const [mday, setMday] = useState(1);
  const [trip, setTrip] = useState(null);
  const [sday, setSday] = useState(1);
  const [mapB, setMapB] = useState(false);
  const [set, setSet] = useState({ l: 'tr', d: false });
  const [genM, setGenM] = useState(false);
  const [lbM, setLbM] = useState(false);
  const [revM, setRevM] = useState(false);
  const [selSpot, setSelSpot] = useState(null);
  const [revTxt, setRevTxt] = useState('');
  const [revStar, setRevStar] = useState(5);
  const [lbData, setLbData] = useState([]);
  // Multi-city
  const [cities, setCities] = useState([]); // [{city, days, ...}]
  const [multiM, setMultiM] = useState(false);
  const [unsavedTrip, setUnsavedTrip] = useState(null);
  const [spotPhotos, setSpotPhotos] = useState([]);
  const [spotReviews, setSpotReviews] = useState([]);
  const [showComments, setShowComments] = useState(false);
  const [loadingSpot, setLoadingSpot] = useState(false);
  const [myMonthly, setMyMonthly] = useState(null);
  const [lbLoading, setLbLoading] = useState(false);
  // Budget Travel
  const [budgetM, setBudgetM] = useState(false);
  const [budget, setBudget] = useState(300);
  const [budgetDays, setBudgetDays] = useState(3);
  const [budgetCity, setBudgetCity] = useState(null);
  const [noBudget, setNoBudget] = useState(false); // Bütçe fark etmez
  const [allDestM, setAllDestM] = useState(false);
  const [dayPickerM, setDayPickerM] = useState(false); // Gün seçici modal
  const [budgetStep, setBudgetStep] = useState(1); // 1: şehir, 2: bütçe

  const getMonthYear = () => { const d = new Date(); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`; };

  const th = set.d ? { p: PRI, bg: '#1a1a2e', c: '#252540', t: '#fff', t2: '#b0b0b0', t3: '#808080', b: '#333', g: [PRI, '#C45C48'] } : { p: PRI, bg: '#F4F1DE', c: '#fff', t: SEC, t2: '#666', t3: '#999', b: '#e8e8e8', g: [PRI, '#C45C48'] };
  const L = k => {
    const tr = { hi:'Hoş Geldin', login:'Giriş', reg:'Kayıt', email:'E-posta', pass:'Şifre', name:'İsim', noAcc:'Hesabın yok mu?', hasAcc:'Hesabın var mı?', rem:'Hatırla', home:'Ana', trips:'Geziler', prof:'Profil', search:'Ara...', pop:'Popüler', ai:'AI ile Oluştur', days:'gün', day:'Gün', spots:'mekan', noTrip:'Trip yok', first:'İlk tripini yap!', out:'Çıkış', dark:'Karanlık Mod', lang:'Language', pts:'puan', cancel:'İptal', howMany:'Kaç Gün?', min:'dk', city:'Şehir Seç', where:'Nereye?', cont:'Devam', plan:'Planlayalım mı?', yes:'Evet! ✨', no:'Kendim yaparım', prefs:'Tercihler', min3:'3+ seç', gen:'Oluştur', premium:'Premium', unlock:'Premium Al', unlim:'Sınırsız', allDays:'Tüm günler', noAds:'Reklamsız', support:'Destek', trial:'7 Gün Ücretsiz', del:'Sil', sure:'Emin misin?', save:'Kaydet', selDay:'Gün Seç', free:'Gün 1 ücretsiz!', locked:'Kilitli', upgrade:'Premium al', added:'Eklendi', selCat:'Kategori', supTitle:'Destek', supDesc:'Yardıma mı ihtiyacın var?', supEmail:'E-posta Gönder', supFaq:'SSS', creating:'Oluşturuluyor...', leaderboard:'Aylık Liderlik', rank:'Seviye', review:'Yorum Yaz', stars:'Yıldız', showComments:'Yorumları Göster', hideComments:'Yorumları Gizle', noComments:'Henüz yorum yok', beFirst:'İlk yorumu sen yaz!', photos:'Fotoğraflar', writeReview:'Yorum Yaz', yourReview:'Yorumun...', posted:'gönderildi', directions:'Yol Tarifi', monthly:'Bu Ay', reviewsLeft:'yorum hakkı', tripsLeft:'trip hakkı', yourRank:'Sıralaman', monthlyPts:'Aylık Puan', totalPts:'Toplam Puan', maxReached:'Limit doldu!', tripLimit:'Bu ay için trip kaydetme limitine ulaştınız (5/5). Gelecek ay sıfırlanacak!', reviewLimit:'Bu ay için yorum limitine ulaştınız (10/10). Gelecek ay sıfırlanacak!' };
    const en = { hi:'Welcome', login:'Login', reg:'Register', email:'Email', pass:'Password', name:'Name', noAcc:'No account?', hasAcc:'Have account?', rem:'Remember', home:'Home', trips:'Trips', prof:'Profile', search:'Search...', pop:'Popular', ai:'Create with AI', days:'days', day:'Day', spots:'spots', noTrip:'No trips', first:'Create first!', out:'Logout', dark:'Dark Mode', lang:'Language', pts:'pts', cancel:'Cancel', howMany:'How Many?', min:'min', city:'Select City', where:'Where?', cont:'Continue', plan:'Plan for you?', yes:'Yes! ✨', no:'I will plan', prefs:'Preferences', min3:'Select 3+', gen:'Generate', premium:'Premium', unlock:'Go Premium', unlim:'Unlimited', allDays:'All days', noAds:'No ads', support:'Support', trial:'7 Days Free', del:'Delete', sure:'Sure?', save:'Save', selDay:'Select Day', free:'Day 1 free!', locked:'Locked', upgrade:'Upgrade', added:'Added', selCat:'Category', supTitle:'Support', supDesc:'Need help?', supEmail:'Send Email', supFaq:'FAQ', creating:'Creating...', leaderboard:'Monthly Leaderboard', rank:'Rank', review:'Write Review', stars:'Stars', showComments:'Show Comments', hideComments:'Hide Comments', noComments:'No comments yet', beFirst:'Be the first to review!', photos:'Photos', writeReview:'Write Review', yourReview:'Your review...', posted:'posted', directions:'Directions', monthly:'This Month', reviewsLeft:'reviews left', tripsLeft:'trips left', yourRank:'Your Rank', monthlyPts:'Monthly Points', totalPts:'Total Points', maxReached:'Limit reached!', tripLimit:'Monthly trip save limit reached (5/5). Resets next month!', reviewLimit:'Monthly review limit reached (10/10). Resets next month!' };
    return set.l === 'tr' ? tr[k] || k : en[k] || k;
  };

  useEffect(() => { init(); }, []);
  const init = async () => {
    try {
      const s = await AsyncStorage.getItem('t_set'); if (s) setSet(JSON.parse(s));
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) { 
        setU(session.user); 
        await loadD(session.user.id); 
      } else {
        // Session yoksa remember me'den otomatik login dene
        const r = await AsyncStorage.getItem('t_rem'); 
        if (r) { 
          const d = JSON.parse(r); 
          if (d.r && d.e && d.p) { 
            setEm(d.e); 
            setPw(d.p);
            setRm(true);
            // Otomatik login
            try {
              const { data, error } = await supabase.auth.signInWithPassword({ email: d.e, password: d.p });
              if (!error && data.user) {
                setU(data.user);
                await loadD(data.user.id);
                setPw('');
              }
            } catch (e) {}
          } else if (d.r && d.e) {
            setEm(d.e);
            setRm(true);
          }
        }
      }
    } catch (e) {} finally { setLd(false); }
  };
  const loadD = async id => {
    try {
      const { data: st } = await supabase.from('user_stats').select('*').eq('user_id', id).single();
      if (st) { setPts(st.points || 0); setPro(st.is_premium || false); }
      const { data: tr } = await supabase.from('trips').select('*').eq('user_id', id).order('created_at', { ascending: false });
      if (tr) setTrips(tr.map(x => ({ ...x.trip_data, dbId: x.id })));
      // Aylık leaderboard datasını yükle
      await loadMyMonthly(id);
    } catch (e) {}
  };

  const loadMyMonthly = async (userId) => {
    const monthYear = getMonthYear();
    try {
      let { data, error } = await supabase.from('monthly_leaderboard').select('*').eq('user_id', userId).eq('month_year', monthYear).single();
      if (error && error.code === 'PGRST116') {
        // Kayıt yok, oluştur
        const userName = u?.user_metadata?.display_name || u?.email?.split('@')[0] || 'User';
        const { data: newData, error: insertError } = await supabase.from('monthly_leaderboard').insert({ 
          user_id: userId, 
          user_name: userName,
          month_year: monthYear, 
          points: 0, 
          review_count: 0, 
          trip_count: 0,
          max_reviews: 10,
          max_trips: 5
        }).select().single();
        if (!insertError) data = newData;
      } else if (data && data.user_name === 'User') {
        // Eğer user_name hala "User" ise güncelle
        const userName = u?.user_metadata?.display_name || u?.email?.split('@')[0] || 'User';
        if (userName !== 'User') {
          await supabase.from('monthly_leaderboard').update({ user_name: userName }).eq('id', data.id);
          data.user_name = userName;
        }
      }
      if (data) setMyMonthly(data);
    } catch (e) { 
      console.log('Monthly load error:', e);
      // Tablo yoksa bile devam et, limitsiz çalış
      setMyMonthly({ points: 0, review_count: 0, trip_count: 0, max_reviews: 999, max_trips: 999 });
    }
  };

  const addMonthlyPoints = async (type, amount) => {
    if (!u || !myMonthly) return false;
    const monthYear = getMonthYear();
    
    if (type === 'review' && myMonthly.review_count >= myMonthly.max_reviews) {
      Alert.alert('⚠️', L('reviewLimit'));
      return false;
    }
    if (type === 'trip' && myMonthly.trip_count >= myMonthly.max_trips) {
      // saveTrip'te zaten kontrol ediliyor, burada sessiz kal
      return false;
    }

    try {
      const updates = { points: myMonthly.points + amount };
      if (type === 'review') updates.review_count = myMonthly.review_count + 1;
      if (type === 'trip') updates.trip_count = myMonthly.trip_count + 1;

      await supabase.from('monthly_leaderboard').update(updates).eq('user_id', u.id).eq('month_year', monthYear);
      setMyMonthly({ ...myMonthly, ...updates });
      return true;
    } catch (e) { return false; }
  };

  const loadLeaderboard = async () => {
    setLbLoading(true);
    const monthYear = getMonthYear();
    try {
      const { data } = await supabase.from('monthly_leaderboard').select('*').eq('month_year', monthYear).order('points', { ascending: false }).limit(50);
      setLbData(data || []);
    } catch (e) { setLbData([]); }
    setLbLoading(false);
  };
  const saveS = async s => { setSet(s); await AsyncStorage.setItem('t_set', JSON.stringify(s)); };
  const login = async () => {
    if (!em || !pw) return Alert.alert('!', 'Doldur');
    setAl(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email: em.trim().toLowerCase(), password: pw });
      if (error) throw error;
      if (rm) {
        await AsyncStorage.setItem('t_rem', JSON.stringify({ e: em.trim().toLowerCase(), p: pw, r: true }));
      } else {
        await AsyncStorage.removeItem('t_rem');
      }
      setU(data.user); await loadD(data.user.id); setPw('');
    } catch (e) { Alert.alert('!', e.message); } finally { setAl(false); }
  };
  const reg = async () => {
    if (!em || !pw) return Alert.alert('!', 'Doldur');
    if (pw.length < 6) return Alert.alert('!', '6+ karakter');
    setAl(true);
    try {
      const { data, error } = await supabase.auth.signUp({ email: em.trim().toLowerCase(), password: pw, options: { data: { display_name: nm || em.split('@')[0] } } });
      if (error) throw error;
      if (data.user) {
        await supabase.from('user_stats').insert({ user_id: data.user.id, points: 100, display_name: nm || em.split('@')[0], badges: [], is_premium: false });
        setU(data.user); setPts(100); setPw(''); Alert.alert('OK!');
      }
    } catch (e) { Alert.alert('!', e.message); } finally { setAl(false); }
  };
  const logout = () => Alert.alert(L('out'), '?', [{ text: L('cancel'), style: 'cancel' }, { text: L('out'), style: 'destructive', onPress: async () => { await supabase.auth.signOut(); setU(null); setPts(0); setTrips([]); setProfM(false); } }]);

  const searchC = async q => {
    if (q.length < 2) return setCr([]);
    setCl(true);
    try {
      const r = await fetch(`https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(q)}&types=(cities)&key=${GAPI}`);
      const d = await r.json();
      if (d.predictions) setCr(d.predictions.map(p => ({ id: p.place_id, n: p.structured_formatting.main_text, f: p.description })));
    } catch (e) {} finally { setCl(false); }
  };
  const pickC = async c => {
    setCl(true);
    try {
      const r = await fetch(`https://maps.googleapis.com/maps/api/place/details/json?place_id=${c.id}&fields=geometry,address_components&key=${GAPI}`);
      const d = await r.json();
      if (d.result) {
        const cc = d.result.address_components?.find(x => x.types.includes('country'));
        const countryCode = cc?.short_name || '';
        const flag = getFlag(countryCode);
        setCity({ n: c.n, f: flag, lat: d.result.geometry.location.lat, lng: d.result.geometry.location.lng, c: cc?.long_name || '', code: countryCode });
        setCq(''); setCr([]); setCityM(false); setDayM(true);
      }
    } catch (e) {} finally { setCl(false); }
  };
  const searchCat = async ct => {
    if (!city) return;
    setCatL(true); setCat(ct);
    try {
      const r = await fetch(`https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent((set.l === 'tr' ? ct.tr : ct.en) + ' in ' + city.n)}&location=${city.lat},${city.lng}&radius=15000&key=${GAPI}`);
      const d = await r.json();
      if (d.results) setCatP(d.results.slice(0, 10).map(p => ({ id: p.place_id, n: p.name, a: p.formatted_address, lat: p.geometry.location.lat, lng: p.geometry.location.lng, r: p.rating || 0, img: p.photos?.[0]?.photo_reference ? `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photo_reference=${p.photos[0].photo_reference}&key=${GAPI}` : null, t: set.l === 'tr' ? ct.tr : ct.en })));
    } catch (e) {} finally { setCatL(false); }
  };
  const addS = (s, d) => { if (spots.find(x => x.id === s.id)) return; setSpots([...spots, { ...s, day: d }]); Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); };
  const remS = id => { setSpots(spots.filter(x => x.id !== id)); Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); };

  const genTrip = async () => {
    // Multi-city veya tek şehir
    const allCities = cities.length > 0 ? cities : (city ? [{ ...city, days }] : []);
    if (allCities.length === 0 || prf.length < 3) return;
    
    setGen(true); setPrefM(false); setGenM(true);
    try {
      let totalItin = [];
      let dayCounter = 1;
      
      // Yeme-içme kategorileri
      const foodTypes = ['restaurant', 'cafe', 'food', 'meal_takeaway', 'bakery', 'bar'];
      const isFood = (t) => foodTypes.some(f => t?.toLowerCase().includes(f));
      
      for (const currentCity of allCities) {
        // Turistik yerler için arama
        let touristPlaces = [];
        let foodPlaces = [];
        
        // Turistik yerler
        const touristQueries = ['tourist attractions', 'landmarks', 'museums', 'historical sites'];
        prf.forEach(p => { 
          if (p === 'museum') touristQueries.push('museums'); 
          if (p === 'history') touristQueries.push('historical places');
          if (p === 'nature') touristQueries.push('parks gardens');
          if (p === 'art') touristQueries.push('art galleries');
        });
        
        for (const q of touristQueries.slice(0, 4)) {
          try {
            const r = await fetch(`https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(q + ' in ' + currentCity.n)}&location=${currentCity.lat},${currentCity.lng}&radius=15000&key=${GAPI}`);
            const d = await r.json();
            if (d.results) touristPlaces = [...touristPlaces, ...d.results.slice(0, 5).map(p => ({ id: p.place_id, n: p.name, t: p.types?.[0]?.replace(/_/g, ' ') || 'attraction', lat: p.geometry.location.lat, lng: p.geometry.location.lng, r: p.rating || 0, img: p.photos?.[0]?.photo_reference ? `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photo_reference=${p.photos[0].photo_reference}&key=${GAPI}` : null, isFood: false }))];
          } catch (e) {}
        }
        
        // Restoranlar ve kafeler (ayrı)
        try {
          const rr = await fetch(`https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent('best restaurants in ' + currentCity.n)}&location=${currentCity.lat},${currentCity.lng}&radius=15000&key=${GAPI}`);
          const rd = await rr.json();
          if (rd.results) foodPlaces = [...foodPlaces, ...rd.results.slice(0, 6).map(p => ({ id: p.place_id, n: p.name, t: 'restaurant', lat: p.geometry.location.lat, lng: p.geometry.location.lng, r: p.rating || 0, img: p.photos?.[0]?.photo_reference ? `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photo_reference=${p.photos[0].photo_reference}&key=${GAPI}` : null, isFood: true }))];
        } catch (e) {}
        
        try {
          const rc = await fetch(`https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent('cafes in ' + currentCity.n)}&location=${currentCity.lat},${currentCity.lng}&radius=15000&key=${GAPI}`);
          const cd = await rc.json();
          if (cd.results) foodPlaces = [...foodPlaces, ...cd.results.slice(0, 4).map(p => ({ id: p.place_id, n: p.name, t: 'cafe', lat: p.geometry.location.lat, lng: p.geometry.location.lng, r: p.rating || 0, img: p.photos?.[0]?.photo_reference ? `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photo_reference=${p.photos[0].photo_reference}&key=${GAPI}` : null, isFood: true }))];
        } catch (e) {}
        
        // Unique yap
        const uniqTourist = touristPlaces.filter((p, i, s) => i === s.findIndex(x => x.id === p.id));
        const uniqFood = foodPlaces.filter((p, i, s) => i === s.findIndex(x => x.id === p.id));
        
        // Her güne akıllı dağıt
        const touristPerDay = Math.ceil(uniqTourist.length / currentCity.days);
        const foodPerDay = Math.min(2, Math.ceil(uniqFood.length / currentCity.days)); // Max 2 yeme-içme
        
        for (let d = 1; d <= currentCity.days; d++) {
          // O gün için turistik yerler (3-5 arası)
          const dayTourist = uniqTourist.slice((d - 1) * touristPerDay, d * touristPerDay).slice(0, 5);
          
          // O gün için yeme-içme (1-2 arası)
          const dayFood = uniqFood.slice((d - 1) * foodPerDay, d * foodPerDay).slice(0, 2);
          
          // Akıllı sıralama: Sabah turistik > Öğle yemek > Öğleden sonra turistik > Akşam kafe/yemek
          let daySpots = [];
          if (dayTourist.length >= 2) daySpots.push(dayTourist[0], dayTourist[1]); // Sabah 2 yer
          if (dayFood.length >= 1) daySpots.push(dayFood[0]); // Öğle yemeği
          if (dayTourist.length >= 4) daySpots.push(dayTourist[2], dayTourist[3]); // Öğleden sonra
          else if (dayTourist.length >= 3) daySpots.push(dayTourist[2]);
          if (dayFood.length >= 2) daySpots.push(dayFood[1]); // Akşam kafe/yemek
          if (dayTourist.length >= 5) daySpots.push(dayTourist[4]); // Varsa son yer
          
          // Mesafe hesapla
          const sp = daySpots.map((s, i, a) => i === 0 ? { ...s, dst: null, wk: null } : { ...s, dst: dist(a[i-1].lat, a[i-1].lng, s.lat, s.lng), wk: walk(parseFloat(dist(a[i-1].lat, a[i-1].lng, s.lat, s.lng))) });
          
          totalItin.push({ d: dayCounter, spots: sp, city: currentCity.n, flag: currentCity.f, lat: currentCity.lat, lng: currentCity.lng });
          dayCounter++;
        }
      }
      
      const totalDays = allCities.reduce((a, c) => a + c.days, 0);
      const flags = [...new Set(allCities.map(c => c.f))].join('/');
      const cityNames = allCities.map(c => c.n).join(' → ');
      const firstCity = allCities[0];
      
      const tr = { 
        id: Date.now().toString(), 
        city: cityNames, 
        country: firstCity.c, 
        days: totalDays, 
        flag: flags, 
        lat: firstCity.lat, 
        lng: firstCity.lng, 
        itin: totalItin, 
        ai: true,
        multiCity: allCities.length > 1,
        cities: allCities
      };
      setUnsavedTrip(tr);
      setTrip(tr); setSday(1); setScr('detail'); setCity(null); setPrf([]); setCities([]);
    } catch (e) { Alert.alert('!'); } finally { setGen(false); setGenM(false); }
  };

  const genBudgetTrip = async () => {
    if (!budgetCity) return;
    setGen(true); setBudgetM(false); setGenM(true);
    try {
      let touristPlaces = [];
      let foodPlaces = [];
      
      // Bütçeye göre query'ler
      const budgetQueries = noBudget 
        ? ['top attractions', 'museums', 'luxury experiences', 'famous landmarks', 'popular tours', 'best viewpoints']
        : ['free attractions', 'parks', 'public squares', 'street markets', 'walking tours', 'viewpoints'];
      
      for (const q of budgetQueries) {
        try {
          const r = await fetch(`https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(q + ' in ' + budgetCity.n)}&location=${budgetCity.lat},${budgetCity.lng}&radius=15000&key=${GAPI}`);
          const d = await r.json();
          if (d.results) touristPlaces = [...touristPlaces, ...d.results.slice(0, 4).map(p => ({ 
            id: p.place_id, 
            n: p.name, 
            t: p.types?.[0]?.replace(/_/g, ' ') || 'attraction', 
            lat: p.geometry.location.lat, 
            lng: p.geometry.location.lng, 
            r: p.rating || 0, 
            img: p.photos?.[0]?.photo_reference ? `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photo_reference=${p.photos[0].photo_reference}&key=${GAPI}` : null, 
            isFood: false,
            // Maliyet tahmini - place type'a göre
            cost: estimateCost(p.types, false, noBudget)
          }))];
        } catch (e) {}
      }
      
      // Yeme-içme - bütçeye göre
      const foodQueries = noBudget 
        ? ['fine dining', 'best restaurants', 'rooftop restaurants', 'michelin restaurants']
        : ['street food', 'local food market', 'cheap eats', 'budget restaurants', 'food stalls'];
      
      for (const q of foodQueries.slice(0, 3)) {
        try {
          const r = await fetch(`https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(q + ' in ' + budgetCity.n)}&location=${budgetCity.lat},${budgetCity.lng}&radius=15000&key=${GAPI}`);
          const d = await r.json();
          if (d.results) foodPlaces = [...foodPlaces, ...d.results.slice(0, 3).map(p => ({ 
            id: p.place_id, 
            n: p.name, 
            t: noBudget ? 'restaurant' : 'street food', 
            lat: p.geometry.location.lat, 
            lng: p.geometry.location.lng, 
            r: p.rating || 0, 
            img: p.photos?.[0]?.photo_reference ? `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photo_reference=${p.photos[0].photo_reference}&key=${GAPI}` : null, 
            isFood: true,
            cost: estimateCost(p.types, true, noBudget)
          }))];
        } catch (e) {}
      }
      
      const uniqTourist = touristPlaces.filter((p, i, s) => i === s.findIndex(x => x.id === p.id));
      const uniqFood = foodPlaces.filter((p, i, s) => i === s.findIndex(x => x.id === p.id));
      
      const touristPerDay = Math.ceil(uniqTourist.length / budgetDays);
      const itin = [];
      
      for (let d = 1; d <= budgetDays; d++) {
        const dayTourist = uniqTourist.slice((d - 1) * touristPerDay, d * touristPerDay).slice(0, 4);
        const dayFood = uniqFood.slice((d - 1) * 2, d * 2).slice(0, 2);
        
        let daySpots = [];
        if (dayTourist[0]) daySpots.push(dayTourist[0]);
        if (dayTourist[1]) daySpots.push(dayTourist[1]);
        if (dayFood[0]) daySpots.push(dayFood[0]);
        if (dayTourist[2]) daySpots.push(dayTourist[2]);
        if (dayTourist[3]) daySpots.push(dayTourist[3]);
        if (dayFood[1]) daySpots.push(dayFood[1]);
        
        const sp = daySpots.map((s, i, a) => i === 0 ? { ...s, dst: null, wk: null } : { ...s, dst: dist(a[i-1].lat, a[i-1].lng, s.lat, s.lng), wk: walk(parseFloat(dist(a[i-1].lat, a[i-1].lng, s.lat, s.lng))) });
        itin.push({ d, spots: sp, city: budgetCity.n, flag: budgetCity.f, lat: budgetCity.lat, lng: budgetCity.lng });
      }
      
      const tr = { 
        id: Date.now().toString(), 
        city: budgetCity.n, 
        country: budgetCity.c, 
        days: budgetDays, 
        flag: budgetCity.f || '🌍', 
        lat: budgetCity.lat, 
        lng: budgetCity.lng, 
        itin, 
        ai: true,
        budget: !noBudget,
        budgetAmount: noBudget ? null : budget
      };
      setUnsavedTrip(tr);
      setTrip(tr); setSday(1); setScr('detail'); setBudgetCity(null); setBudget(300); setBudgetDays(3); setNoBudget(false);
    } catch (e) { Alert.alert('!'); } finally { setGen(false); setGenM(false); }
  };

  // Yeni akış için - budgetCity + preferences ile trip oluştur
  const genTripWithBudget = async () => {
    if (!budgetCity || prf.length < 3) return;
    setGen(true); setPrefM(false); setGenM(true);
    try {
      const isUnlimited = budget > 1000;
      let touristPlaces = [];
      let foodPlaces = [];
      
      // Preference'lara göre TURİSTİK query'ler oluştur (yemek hariç!)
      const prefQueries = [];
      prf.forEach(p => { 
        if (p === 'museum') prefQueries.push('museums', 'art museums');
        if (p === 'history') prefQueries.push('historical sites', 'monuments', 'historic landmarks');
        if (p === 'nature') prefQueries.push('parks', 'gardens', 'nature reserves');
        if (p === 'art') prefQueries.push('art galleries', 'art exhibitions');
        if (p === 'architecture') prefQueries.push('famous architecture', 'historic buildings', 'landmarks');
        if (p === 'nightlife') prefQueries.push('nightlife districts', 'entertainment');
        if (p === 'shopping') prefQueries.push('shopping districts', 'famous markets');
        if (p === 'beach') prefQueries.push('beaches', 'waterfront', 'seaside');
        if (p === 'adventure') prefQueries.push('adventure activities', 'outdoor tours');
        // food preference'ı turistik yerlere ekleme!
      });
      
      // Her zaman temel turistik yerler ekle
      prefQueries.push('tourist attractions', 'famous landmarks', 'must see places');
      
      // Bütçeye göre ek query'ler
      if (!isUnlimited) {
        prefQueries.push('free attractions', 'public parks');
      } else {
        prefQueries.push('top attractions', 'premium experiences');
      }
      
      // Turistik yerleri çek (yemek yerleri HARİÇ)
      const foodTypes = ['restaurant', 'cafe', 'food', 'bakery', 'bar', 'meal'];
      
      for (const q of prefQueries.slice(0, 6)) {
        try {
          const r = await fetch(`https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(q + ' in ' + budgetCity.n)}&location=${budgetCity.lat},${budgetCity.lng}&radius=15000&key=${GAPI}`);
          const d = await r.json();
          if (d.results) {
            // Yemek yerlerini filtrele
            const filtered = d.results.filter(p => {
              const types = (p.types || []).join(' ').toLowerCase();
              return !foodTypes.some(ft => types.includes(ft));
            });
            touristPlaces = [...touristPlaces, ...filtered.slice(0, 5).map(p => ({ 
              id: p.place_id, 
              n: p.name, 
              t: p.types?.[0]?.replace(/_/g, ' ') || 'attraction', 
              lat: p.geometry.location.lat, 
              lng: p.geometry.location.lng, 
              r: p.rating || 0, 
              img: p.photos?.[0]?.photo_reference ? `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photo_reference=${p.photos[0].photo_reference}&key=${GAPI}` : null, 
              isFood: false,
              cost: estimateCost(p.types, false, isUnlimited)
            }))];
          }
        } catch (e) {}
      }
      
      // Yeme-içme - bütçeye göre (AYRI olarak çek)
      const foodQueries = isUnlimited 
        ? ['fine dining', 'best restaurants', 'rooftop restaurants']
        : ['street food', 'local restaurants', 'cafes'];
      
      for (const q of foodQueries) {
        try {
          const r = await fetch(`https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(q + ' in ' + budgetCity.n)}&location=${budgetCity.lat},${budgetCity.lng}&radius=15000&key=${GAPI}`);
          const d = await r.json();
          if (d.results) foodPlaces = [...foodPlaces, ...d.results.slice(0, 3).map(p => ({ 
            id: p.place_id, 
            n: p.name, 
            t: isUnlimited ? 'restaurant' : 'local food', 
            lat: p.geometry.location.lat, 
            lng: p.geometry.location.lng, 
            r: p.rating || 0, 
            img: p.photos?.[0]?.photo_reference ? `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photo_reference=${p.photos[0].photo_reference}&key=${GAPI}` : null, 
            isFood: true,
            cost: estimateCost(p.types, true, isUnlimited)
          }))];
        } catch (e) {}
      }
      
      // Unique yap ve yemek yerlerini turistik yerlerden çıkar
      const uniqTourist = touristPlaces
        .filter((p, i, s) => i === s.findIndex(x => x.id === p.id))
        .filter(p => !p.isFood);
      const uniqFood = foodPlaces.filter((p, i, s) => i === s.findIndex(x => x.id === p.id));
      
      // Yerleri merkeze yakınlıklarına göre sırala
      const sortByDistance = (places, centerLat, centerLng) => {
        return [...places].sort((a, b) => {
          const distA = Math.sqrt(Math.pow(a.lat - centerLat, 2) + Math.pow(a.lng - centerLng, 2));
          const distB = Math.sqrt(Math.pow(b.lat - centerLat, 2) + Math.pow(b.lng - centerLng, 2));
          return distA - distB;
        });
      };
      
      // Nearest neighbor algoritması - birbirine yakın yerleri seç
      const selectNearbyPlaces = (places, startLat, startLng, count) => {
        if (places.length === 0) return [];
        const result = [];
        const remaining = [...places];
        let currentLat = startLat;
        let currentLng = startLng;
        
        while (result.length < count && remaining.length > 0) {
          // En yakın yeri bul
          let nearestIdx = 0;
          let nearestDist = Infinity;
          
          for (let i = 0; i < remaining.length; i++) {
            const d = Math.sqrt(Math.pow(remaining[i].lat - currentLat, 2) + Math.pow(remaining[i].lng - currentLng, 2));
            if (d < nearestDist) {
              nearestDist = d;
              nearestIdx = i;
            }
          }
          
          // 2km'den uzaksa (yaklaşık 0.02 derece) atla
          if (nearestDist > 0.03 && result.length >= 3) break;
          
          result.push(remaining[nearestIdx]);
          currentLat = remaining[nearestIdx].lat;
          currentLng = remaining[nearestIdx].lng;
          remaining.splice(nearestIdx, 1);
        }
        
        return result;
      };
      
      // Her güne en az 4 turistik yer düşsün
      const itin = [];
      let usedTouristIds = new Set();
      let usedFoodIds = new Set();
      
      for (let d = 1; d <= budgetDays; d++) {
        // Kullanılmamış turistik yerleri al
        const availableTourist = uniqTourist.filter(p => !usedTouristIds.has(p.id));
        const availableFood = uniqFood.filter(p => !usedFoodIds.has(p.id));
        
        // Merkeze yakın turistik yerleri seç (4-5 tane)
        const dayTourist = selectNearbyPlaces(availableTourist, budgetCity.lat, budgetCity.lng, 5);
        dayTourist.forEach(p => usedTouristIds.add(p.id));
        
        // Seçilen turistik yerlere yakın yemek yeri bul
        const centerLat = dayTourist.length > 0 ? dayTourist[Math.floor(dayTourist.length / 2)].lat : budgetCity.lat;
        const centerLng = dayTourist.length > 0 ? dayTourist[Math.floor(dayTourist.length / 2)].lng : budgetCity.lng;
        const dayFood = selectNearbyPlaces(availableFood, centerLat, centerLng, 2);
        dayFood.forEach(p => usedFoodIds.add(p.id));
        
        // Akıllı sıralama: 2 turistik > 1 yemek > 2-3 turistik > (opsiyonel yemek)
        let daySpots = [];
        
        // Sabah: 2 turistik yer
        if (dayTourist[0]) daySpots.push(dayTourist[0]);
        if (dayTourist[1]) daySpots.push(dayTourist[1]);
        
        // Öğle: 1 yemek
        if (dayFood[0]) daySpots.push(dayFood[0]);
        
        // Öğleden sonra: 2-3 turistik yer  
        if (dayTourist[2]) daySpots.push(dayTourist[2]);
        if (dayTourist[3]) daySpots.push(dayTourist[3]);
        if (dayTourist[4]) daySpots.push(dayTourist[4]);
        
        // Akşam: 1 yemek (sadece 6+ spot varsa)
        if (dayFood[1] && daySpots.length >= 5) daySpots.push(dayFood[1]);
        
        const sp = daySpots.map((s, i, a) => i === 0 ? { ...s, dst: null, wk: null } : { ...s, dst: dist(a[i-1].lat, a[i-1].lng, s.lat, s.lng), wk: walk(parseFloat(dist(a[i-1].lat, a[i-1].lng, s.lat, s.lng))) });
        itin.push({ d, spots: sp, city: budgetCity.n, flag: budgetCity.f, lat: budgetCity.lat, lng: budgetCity.lng });
      }
      
      const tr = { 
        id: Date.now().toString(), 
        city: budgetCity.n, 
        country: budgetCity.c, 
        days: budgetDays, 
        flag: budgetCity.f || '🌍', 
        lat: budgetCity.lat, 
        lng: budgetCity.lng, 
        itin, 
        ai: true,
        budget: !isUnlimited,
        budgetAmount: isUnlimited ? null : budget
      };
      setUnsavedTrip(tr);
      setTrip(tr); setSday(1); setScr('detail'); setBudgetCity(null); setBudget(300); setBudgetDays(3); setPrf([]);
    } catch (e) { Alert.alert('!'); } finally { setGen(false); setGenM(false); }
  };

  // Maliyet tahmini fonksiyonu
  const estimateCost = (types, isFood, isLuxury) => {
    if (!types) return isFood ? (isLuxury ? 80 : 10) : (isLuxury ? 50 : 0);
    
    const typeStr = types.join(' ');
    
    if (isFood) {
      if (isLuxury) return Math.floor(Math.random() * 50) + 60; // $60-110
      if (typeStr.includes('street') || typeStr.includes('market')) return Math.floor(Math.random() * 8) + 5; // $5-12
      return Math.floor(Math.random() * 15) + 10; // $10-25
    }
    
    // Turistik yerler
    if (typeStr.includes('park') || typeStr.includes('square') || typeStr.includes('street')) return 0; // Ücretsiz
    if (typeStr.includes('museum')) return isLuxury ? Math.floor(Math.random() * 20) + 25 : Math.floor(Math.random() * 10) + 10; // $10-20 veya $25-45
    if (typeStr.includes('church') || typeStr.includes('mosque') || typeStr.includes('temple')) return Math.floor(Math.random() * 5) + 5; // $5-10
    if (typeStr.includes('tower') || typeStr.includes('viewpoint')) return Math.floor(Math.random() * 10) + 15; // $15-25
    if (typeStr.includes('palace') || typeStr.includes('castle')) return Math.floor(Math.random() * 15) + 20; // $20-35
    
    return isLuxury ? Math.floor(Math.random() * 30) + 30 : Math.floor(Math.random() * 10) + 5; // Default
  };

  const saveMan = async () => {
    if (spots.length === 0) return Alert.alert('!', 'Ekle');
    setGen(true); setManM(false);
    try {
      const itin = [];
      for (let d = 1; d <= days; d++) {
        const sp = spots.filter(s => s.day === d).map((s, i, a) => i === 0 ? { ...s, dst: null, wk: null } : { ...s, dst: dist(a[i-1].lat, a[i-1].lng, s.lat, s.lng), wk: walk(parseFloat(dist(a[i-1].lat, a[i-1].lng, s.lat, s.lng))) });
        if (sp.length > 0) itin.push({ d: itin.length + 1, spots: sp, lock: false });
      }
      // Sadece dolu günleri say
      const actualDays = itin.length;
      const tr = { id: Date.now().toString(), city: city.n, country: city.c, days: actualDays, flag: city.f || '🌍', lat: city.lat, lng: city.lng, itin, ai: false };
      const { data: ins } = await supabase.from('trips').insert({ user_id: u.id, trip_data: tr }).select().single();
      const np = pts + 30;
      await supabase.from('user_stats').update({ points: np }).eq('user_id', u.id);
      setPts(np); setTrips(pv => [{ ...tr, dbId: ins?.id }, ...pv]); setTrip({ ...tr, dbId: ins?.id }); setSday(1); setScr('detail'); setCity(null); setSpots([]);
    } catch (e) { Alert.alert('!'); } finally { setGen(false); }
  };

  const delTr = async tr => { try { if (tr.dbId) await supabase.from('trips').delete().eq('id', tr.dbId); setTrips(pv => pv.filter(x => x.id !== tr.id)); setDelM(false); setDelT(null); if (trip?.id === tr.id) { setScr('home'); setTrip(null); } } catch (e) {} };
  const openD = s => { const url = Platform.select({ ios: `maps://app?daddr=${s.lat},${s.lng}`, android: `google.navigation:q=${s.lat},${s.lng}` }); Linking.canOpenURL(url).then(ok => ok ? Linking.openURL(url) : Linking.openURL(`https://www.google.com/maps/dir/?api=1&destination=${s.lat},${s.lng}`)); };
  const pickDay = (d) => { setSday(d); };

  const saveTrip = async () => {
    if (!unsavedTrip) return;
    // Aylık limit kontrolü - myMonthly yoksa limitsiz kabul et
    if (myMonthly && myMonthly.trip_count >= myMonthly.max_trips) {
      Alert.alert('⚠️', L('tripLimit'));
      return;
    }
    try {
      const { data: ins, error } = await supabase.from('trips').insert({ user_id: u.id, trip_data: unsavedTrip }).select().single();
      if (error) throw error;
      const np = pts + 50;
      await supabase.from('user_stats').update({ points: np }).eq('user_id', u.id);
      setPts(np);
      // Aylık puan ekle
      addMonthlyPoints('trip', 50);
      const saved = { ...unsavedTrip, dbId: ins?.id };
      setTrips(pv => [saved, ...pv]);
      setTrip(saved);
      setUnsavedTrip(null);
      Alert.alert('✅', set.l === 'tr' ? 'Trip kaydedildi! +50 puan' : 'Trip saved! +50 pts');
    } catch (e) { 
      console.log('Save error:', e);
      Alert.alert('!', e.message || 'Kaydetme hatası'); 
    }
  };

  const getRank = (p) => RANKS.find(r => p >= r.min && p <= r.max) || RANKS[0];

  const loadLb = async (rankId) => {
    try {
      const rank = RANKS.find(r => r.id === rankId);
      if (!rank) return;
      const { data } = await supabase.from('user_stats').select('*').gte('points', rank.min).lte('points', rank.max).order('points', { ascending: false }).limit(50);
      setLbData(data || []);
    } catch (e) { setLbData([]); }
  };

  const moveSpot = (fromIdx, toIdx) => {
    if (!trip || !trip.itin) return;
    const dayData = trip.itin.find(x => x.d === sday);
    if (!dayData) return;
    const newSpots = [...dayData.spots];
    const [moved] = newSpots.splice(fromIdx, 1);
    newSpots.splice(toIdx, 0, moved);
    const recalc = newSpots.map((s, i, a) => i === 0 ? { ...s, dst: null, wk: null } : { ...s, dst: dist(a[i-1].lat, a[i-1].lng, s.lat, s.lng), wk: walk(parseFloat(dist(a[i-1].lat, a[i-1].lng, s.lat, s.lng))) });
    const newItin = trip.itin.map(x => x.d === sday ? { ...x, spots: recalc } : x);
    setTrip({ ...trip, itin: newItin });
    if (unsavedTrip) setUnsavedTrip({ ...unsavedTrip, itin: newItin });
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const delSpot = (idx) => {
    if (!trip || !trip.itin) return;
    const dayData = trip.itin.find(x => x.d === sday);
    if (!dayData) return;
    const newSpots = dayData.spots.filter((_, i) => i !== idx);
    const recalc = newSpots.map((s, i, a) => i === 0 ? { ...s, dst: null, wk: null } : { ...s, dst: dist(a[i-1].lat, a[i-1].lng, s.lat, s.lng), wk: walk(parseFloat(dist(a[i-1].lat, a[i-1].lng, s.lat, s.lng))) });
    const newItin = trip.itin.map(x => x.d === sday ? { ...x, spots: recalc } : x);
    setTrip({ ...trip, itin: newItin });
    if (unsavedTrip) setUnsavedTrip({ ...unsavedTrip, itin: newItin });
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  // Rota Optimizasyonu - En kısa yol (Nearest Neighbor Algorithm)
  const optimizeRoute = () => {
    if (!trip || !trip.itin) return;
    const dayData = trip.itin.find(x => x.d === sday);
    if (!dayData || dayData.spots.length < 3) {
      Alert.alert('!', set.l === 'tr' ? 'En az 3 mekan gerekli' : 'Need at least 3 spots');
      return;
    }
    
    const spots = [...dayData.spots];
    const optimized = [spots[0]]; // İlk noktadan başla
    const remaining = spots.slice(1);
    
    // Nearest Neighbor: Her adımda en yakın noktaya git
    while (remaining.length > 0) {
      const last = optimized[optimized.length - 1];
      let nearestIdx = 0;
      let nearestDist = Infinity;
      
      remaining.forEach((spot, idx) => {
        const d = parseFloat(dist(last.lat, last.lng, spot.lat, spot.lng));
        if (d < nearestDist) {
          nearestDist = d;
          nearestIdx = idx;
        }
      });
      
      optimized.push(remaining[nearestIdx]);
      remaining.splice(nearestIdx, 1);
    }
    
    // Mesafeleri yeniden hesapla
    const recalc = optimized.map((s, i, a) => i === 0 ? { ...s, dst: null, wk: null } : { ...s, dst: dist(a[i-1].lat, a[i-1].lng, s.lat, s.lng), wk: walk(parseFloat(dist(a[i-1].lat, a[i-1].lng, s.lat, s.lng))) });
    
    const newItin = trip.itin.map(x => x.d === sday ? { ...x, spots: recalc } : x);
    setTrip({ ...trip, itin: newItin });
    if (unsavedTrip) setUnsavedTrip({ ...unsavedTrip, itin: newItin });
    
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    Alert.alert('✅', set.l === 'tr' ? 'Rota optimize edildi!' : 'Route optimized!');
  };

  const submitReview = async () => {
    if (!selSpot || !revTxt.trim()) return;
    // Aylık limit kontrolü
    if (myMonthly && myMonthly.review_count >= myMonthly.max_reviews) {
      Alert.alert('⚠️', L('maxReached'));
      return;
    }
    try {
      await supabase.from('reviews').insert({ user_id: u.id, place_id: selSpot.id, place_name: selSpot.n, rating: revStar, comment: revTxt.trim(), user_name: u?.user_metadata?.display_name || u?.email?.split('@')[0] });
      const np = pts + 10;
      await supabase.from('user_stats').update({ points: np }).eq('user_id', u.id);
      setPts(np);
      // Aylık puan ekle
      await addMonthlyPoints('review', 10);
      setRevTxt(''); setRevStar(5);
      Alert.alert('✅', set.l === 'tr' ? 'Yorum eklendi! +10 puan' : 'Review added! +10 pts');
      // Yorumları yenile
      loadSpotReviews(selSpot.id);
    } catch (e) { Alert.alert('!', e.message); }
  };

  const openSpotDetail = async (spot) => {
    setSelSpot(spot);
    setRevM(true);
    setShowComments(false);
    setSpotPhotos([]);
    setSpotReviews([]);
    setLoadingSpot(true);
    // Fotoğrafları yükle
    await loadSpotPhotos(spot.id);
    // Yorumları yükle
    await loadSpotReviews(spot.id);
    setLoadingSpot(false);
  };

  const loadSpotPhotos = async (placeId) => {
    try {
      const r = await fetch(`https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=photos&key=${GAPI}`);
      const d = await r.json();
      if (d.result?.photos) {
        const photos = d.result.photos.slice(0, 5).map(p => 
          `https://maps.googleapis.com/maps/api/place/photo?maxwidth=600&photo_reference=${p.photo_reference}&key=${GAPI}`
        );
        setSpotPhotos(photos);
      }
    } catch (e) { setSpotPhotos([]); }
  };

  const loadSpotReviews = async (placeId) => {
    try {
      const { data } = await supabase.from('reviews').select('*').eq('place_id', placeId).order('created_at', { ascending: false });
      setSpotReviews(data || []);
    } catch (e) { setSpotReviews([]); }
  };

  const openSupport = () => { Linking.openURL('mailto:support@tourista.app?subject=Tourista%20Support'); };

  const forgotPassword = async () => {
    if (!em || !em.includes('@')) {
      Alert.alert('!', set.l === 'tr' ? 'Lütfen geçerli e-posta girin' : 'Please enter a valid email');
      return;
    }
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(em.trim().toLowerCase());
      if (error) throw error;
      Alert.alert('✅', set.l === 'tr' ? 'Şifre sıfırlama linki gönderildi!' : 'Password reset link sent!');
    } catch (e) { Alert.alert('!', e.message); }
  };

  if (ld) return <View style={[S.ctr, { backgroundColor: th.bg }]}><Text style={{ fontSize: 64 }}>🌍</Text><Text style={[S.logo, { color: th.p }]}>TOURISTA</Text><ActivityIndicator size="large" color={th.p} style={{ marginTop: 20 }} /></View>;

  if (!u) return (
    <SafeAreaView style={[S.c, { backgroundColor: th.bg }]}>
      <StatusBar barStyle="light-content" />
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
          <LinearGradient colors={th.g} style={S.ah}><Text style={{ fontSize: 64 }}>🌍</Text><Text style={S.an}>TOURISTA</Text><Text style={S.at}>{set.l === 'tr' ? 'Planla, Keşfet, Paylaş' : 'Plan, Explore, Share'}</Text></LinearGradient>
          <View style={[S.af, { backgroundColor: th.bg }]}>
            <Text style={[S.aft, { color: th.p }]}>{am === 'login' ? L('hi') + ' 👋' : L('reg') + ' ✨'}</Text>
            {am === 'register' && <View style={S.ic}><Text style={[S.il, { color: th.t2 }]}>{L('name')}</Text><TextInput style={[S.inp, { backgroundColor: th.c, color: th.t, borderColor: th.b }]} placeholder="Ad" placeholderTextColor={th.t3} value={nm} onChangeText={setNm} /></View>}
            <View style={S.ic}><Text style={[S.il, { color: th.t2 }]}>{L('email')}</Text><TextInput style={[S.inp, { backgroundColor: th.c, color: th.t, borderColor: th.b }]} placeholder="email@x.com" placeholderTextColor={th.t3} value={em} onChangeText={setEm} keyboardType="email-address" autoCapitalize="none" /></View>
            <View style={S.ic}><Text style={[S.il, { color: th.t2 }]}>{L('pass')}</Text><TextInput style={[S.inp, { backgroundColor: th.c, color: th.t, borderColor: th.b }]} placeholder="••••••" placeholderTextColor={th.t3} value={pw} onChangeText={setPw} secureTextEntry /></View>
            {am === 'login' && <TouchableOpacity style={S.rc} onPress={() => setRm(!rm)}><View style={[S.chk, rm && { backgroundColor: th.p, borderColor: th.p }]}>{rm && <Text style={S.chkm}>✓</Text>}</View><Text style={[S.rt, { color: th.t2 }]}>{set.l === 'tr' ? 'Beni Hatırla' : 'Remember Me'}</Text></TouchableOpacity>}
            {am === 'login' && <TouchableOpacity style={S.fp} onPress={forgotPassword}><Text style={[S.fpt, { color: th.p }]}>{set.l === 'tr' ? 'Şifremi Unuttum' : 'Forgot Password?'}</Text></TouchableOpacity>}
            <Btn style={S.ab} onPress={am === 'login' ? login : reg} disabled={al}><LinearGradient colors={th.g} style={S.abg}>{al ? <ActivityIndicator color="#fff" /> : <Text style={S.abt}>{am === 'login' ? L('login') : L('reg')}</Text>}</LinearGradient></Btn>
            <TouchableOpacity style={S.sw} onPress={() => setAm(am === 'login' ? 'register' : 'login')}><Text style={{ color: th.t2 }}>{am === 'login' ? L('noAcc') : L('hasAcc')} <Text style={{ color: th.p, fontWeight: '600' }}>{am === 'login' ? L('reg') : L('login')}</Text></Text></TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );

  if (scr === 'detail' && trip) {
    const dd = trip.itin?.find(x => x.d === sday) || trip.itin?.[0];
    const sp = dd?.spots || [];
    const currentCityLat = dd?.lat || trip.lat;
    const currentCityLng = dd?.lng || trip.lng;
    const currentCityName = dd?.city || trip.city;
    const currentCityFlag = dd?.flag || trip.flag;
    return (
      <SafeAreaView style={[S.c, { backgroundColor: th.bg }]}>
        <StatusBar barStyle="light-content" />
        <LinearGradient colors={th.g} style={S.sh}><Btn onPress={() => { setScr('home'); setTrip(null); setUnsavedTrip(null); }} style={S.bk}><Text style={S.bkt}>←</Text></Btn><View style={S.htc}><Text style={S.st} numberOfLines={1}>{trip.flag} {trip.multiCity ? currentCityName : trip.city}</Text><Text style={S.sst}>{trip.days} {L('days')}</Text></View>{unsavedTrip ? <HapticBtn style={S.svhb} onPress={saveTrip} type="success"><Text style={S.svhbt}>💾</Text></HapticBtn> : <HapticBtn style={S.db} onPress={() => { setDelT(trip); setDelM(true); }} type="warning"><Text style={S.dbt}>🗑️</Text></HapticBtn>}</LinearGradient>
        <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
          <TouchableOpacity style={[S.mc, mapB && S.me]} onLongPress={() => setMapB(!mapB)} delayLongPress={300} activeOpacity={1}><MapView style={S.map} region={{ latitude: currentCityLat, longitude: currentCityLng, latitudeDelta: 0.08, longitudeDelta: 0.08 }}>{sp.length > 1 && <Polyline coordinates={sp.filter(s => s.lat).map(s => ({ latitude: s.lat, longitude: s.lng }))} strokeColor={COLORS[(sday - 1) % 7]} strokeWidth={3} />}{sp.map((s, i) => s.lat && <Marker key={i} coordinate={{ latitude: s.lat, longitude: s.lng }}><View style={[S.mk, { backgroundColor: COLORS[(sday - 1) % 7] }]}><Text style={S.mkt}>{i + 1}</Text></View></Marker>)}</MapView><View style={S.mapHint}><Text style={S.mapHintT}>{mapB ? '🔽' : '🔼'}</Text></View></TouchableOpacity>
          {/* Multi-city şehir göstergesi */}
          {trip.multiCity && <View style={[S.mcCityBadge, { backgroundColor: th.c }]}><Text style={S.mcCityBadgeF}>{currentCityFlag}</Text><Text style={[S.mcCityBadgeT, { color: th.t }]}>{currentCityName}</Text></View>}
          {/* Bütçe özeti - sadece maliyet varsa göster */}
          {sp.some(s => s.cost !== undefined) && (
            <View style={[S.budgetSummary, { backgroundColor: th.c }]}>
              <View style={S.budgetSummaryItem}>
                <Text style={[S.budgetSummaryLabel, { color: th.t3 }]}>{set.l === 'tr' ? 'Bugün' : 'Today'}</Text>
                <Text style={[S.budgetSummaryValue, { color: '#4CAF50' }]}>${sp.reduce((a, s) => a + (s.cost || 0), 0)}</Text>
              </View>
              <View style={S.budgetSummaryDivider} />
              <View style={S.budgetSummaryItem}>
                <Text style={[S.budgetSummaryLabel, { color: th.t3 }]}>{set.l === 'tr' ? 'Toplam' : 'Total'}</Text>
                <Text style={[S.budgetSummaryValue, { color: th.p }]}>${trip.itin?.reduce((t, day) => t + (day.spots?.reduce((a, s) => a + (s.cost || 0), 0) || 0), 0)}</Text>
              </View>
              {trip.budgetAmount && (
                <>
                  <View style={S.budgetSummaryDivider} />
                  <View style={S.budgetSummaryItem}>
                    <Text style={[S.budgetSummaryLabel, { color: th.t3 }]}>{set.l === 'tr' ? 'Bütçe' : 'Budget'}</Text>
                    <Text style={[S.budgetSummaryValue, { color: trip.itin?.reduce((t, day) => t + (day.spots?.reduce((a, s) => a + (s.cost || 0), 0) || 0), 0) > trip.budgetAmount ? '#ef5350' : '#4CAF50' }]}>${trip.budgetAmount}</Text>
                  </View>
                </>
              )}
            </View>
          )}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={S.dts} contentContainerStyle={S.dtsC}>{trip.itin?.map((x, i) => <Btn key={x.d} style={[S.dt, { borderColor: th.b, backgroundColor: th.c }, sday === x.d && { backgroundColor: COLORS[i % 7], borderColor: COLORS[i % 7] }]} onPress={() => pickDay(x.d)}><Text style={[S.dtt, { color: th.t }, sday === x.d && { color: '#fff' }]}>{x.flag ? x.flag + ' ' : ''}{L('day')} {x.d}</Text></Btn>)}<Btn style={[S.optBtn, { backgroundColor: '#4CAF50' }]} onPress={optimizeRoute}><Text style={S.optBtnT}>🚀</Text></Btn></ScrollView>
          <View style={S.sl}>{sp.map((s, i) => <View key={i}>{s.dst && <View style={S.di}><View style={[S.dl, { backgroundColor: th.b }]} /><View style={[S.dib, { backgroundColor: th.c, borderColor: th.b }]}><Text style={[S.dit, { color: th.t2 }]}>🚶 {s.wk} {L('min')}</Text></View><View style={[S.dl, { backgroundColor: th.b }]} /></View>}<Btn style={[S.sc, { backgroundColor: th.c }]} onPress={() => openSpotDetail(s)}><View style={[S.sn, { backgroundColor: COLORS[(sday - 1) % 7] }]}><Text style={S.snt}>{i + 1}</Text></View><PlacePhoto placeName={s.n} cityName={trip?.city} fallbackImg={s.img} style={S.si} /><View style={S.sinf}><Text style={[S.snm, { color: th.t }]} numberOfLines={2}>{s.n}</Text><View style={S.spotMetaRow}><Text style={[S.sty, { color: th.t3 }]}>{s.t}</Text>{s.cost !== undefined && <Text style={[S.spotCost, { color: s.cost === 0 ? '#4CAF50' : '#FFA726' }]}>{s.cost === 0 ? (set.l === 'tr' ? 'Ücretsiz' : 'Free') : `$${s.cost}`}</Text>}</View>{s.r > 0 && <Text style={[S.sr, { color: th.t2 }]}>⭐ {s.r.toFixed(1)}</Text>}</View><View style={S.spActs}>{i > 0 && <Btn style={S.spAct} onPress={() => moveSpot(i, i-1)}><Text style={S.spActT}>↑</Text></Btn>}{i < sp.length - 1 && <Btn style={S.spAct} onPress={() => moveSpot(i, i+1)}><Text style={S.spActT}>↓</Text></Btn>}<Btn style={[S.spAct, { backgroundColor: '#ffebee' }]} onPress={() => delSpot(i)}><Text style={[S.spActT, { color: '#ef5350' }]}>✕</Text></Btn><Btn style={[S.drb, { backgroundColor: th.p }]} onPress={() => openD(s)}><Text style={S.drbt}>🗺️</Text></Btn></View></Btn></View>)}</View>
          <View style={{ height: 40 }} />
        </ScrollView>
        <Modal visible={delM} animationType="fade" transparent><View style={S.mo}><View style={[S.cm, { backgroundColor: th.c }]}><Text style={S.ci}>🗑️</Text><Text style={[S.ct, { color: th.t }]}>{L('del')}</Text><Text style={[S.cd, { color: th.t3 }]}>{L('sure')}</Text><View style={S.cbs}><Btn style={[S.cb, { backgroundColor: th.b }]} onPress={() => { setDelM(false); setDelT(null); }}><Text style={[S.cbt, { color: th.t }]}>{L('cancel')}</Text></Btn><Btn style={[S.cb, { backgroundColor: '#ef5350' }]} onPress={() => delTr(delT)}><Text style={[S.cbt, { color: '#fff' }]}>{L('del')}</Text></Btn></View></View></View></Modal>
        <Modal visible={revM} animationType="slide"><SafeAreaView style={[S.fm, { backgroundColor: th.bg }]}>
          <View style={[S.sdH, { backgroundColor: th.c }]}>
            <Btn style={S.sdBack} onPress={() => { setRevM(false); setSelSpot(null); setRevTxt(''); setRevStar(5); setShowComments(false); setSpotPhotos([]); setSpotReviews([]); }}><Text style={[S.sdBackT, { color: th.t }]}>←</Text></Btn>
            <Text style={[S.sdTitle, { color: th.t }]} numberOfLines={1}>{selSpot?.n}</Text>
            <Btn style={[S.sdDir, { backgroundColor: th.p }]} onPress={() => selSpot && openD(selSpot)}><Text style={S.sdDirT}>🗺️</Text></Btn>
          </View>
          <ScrollView style={S.sdBody}>
            {loadingSpot ? <ActivityIndicator color={th.p} size="large" style={{ marginVertical: 40 }} /> : <>
              {spotPhotos.length > 0 ? <View style={S.sdPhotos}><ScrollView horizontal showsHorizontalScrollIndicator={false}>{spotPhotos.map((p, i) => <Image key={i} source={{ uri: p }} style={S.sdPhoto} />)}</ScrollView></View> : <PlacePhoto placeName={selSpot?.n} cityName={trip?.city} fallbackImg={selSpot?.img} style={{ width: '100%', height: 200, borderRadius: 12, marginBottom: 16 }} />}
              <View style={[S.sdInfo, { backgroundColor: th.c }]}>
                <Text style={[S.sdType, { color: th.t3 }]}>{selSpot?.t}</Text>
                {selSpot?.r > 0 && <View style={S.sdRating}><Text style={S.sdRatingS}>⭐</Text><Text style={[S.sdRatingV, { color: th.t }]}>{selSpot?.r?.toFixed(1)}</Text></View>}
              </View>
              <View style={[S.sdAbout, { backgroundColor: th.c }]}>
                <Text style={[S.sdAboutTitle, { color: th.t }]}>ℹ️ {set.l === 'tr' ? 'Hakkında' : 'About'}</Text>
                <Text style={[S.sdAboutTxt, { color: th.t2 }]}>
                  {selSpot?.t === 'mosque' && (set.l === 'tr' ? `${selSpot?.n}, önemli bir dini ve tarihi yapıdır. Osmanlı mimarisinin en güzel örneklerinden birini temsil eder. Ziyaretçiler burada huzurlu bir atmosfer bulabilir.` : `${selSpot?.n} is an important religious and historical building. It represents one of the finest examples of Ottoman architecture. Visitors can find a peaceful atmosphere here.`)}
                  {selSpot?.t === 'museum' && (set.l === 'tr' ? `${selSpot?.n}, zengin bir koleksiyona ev sahipliği yapan önemli bir müzedir. Tarihi eserler ve sanat eserleri burada sergilenmektedir.` : `${selSpot?.n} is an important museum housing a rich collection. Historical artifacts and artworks are displayed here.`)}
                  {selSpot?.t === 'market' && (set.l === 'tr' ? `${selSpot?.n}, geleneksel ürünler ve yerel lezzetler için mükemmel bir alışveriş noktasıdır. Otantik atmosferi ile ziyaretçilere eşsiz bir deneyim sunar.` : `${selSpot?.n} is a perfect shopping spot for traditional products and local delicacies. It offers visitors a unique experience with its authentic atmosphere.`)}
                  {selSpot?.t === 'landmark' && (set.l === 'tr' ? `${selSpot?.n}, şehrin en tanınmış simgelerinden biridir. Muhteşem manzarası ve tarihi önemi ile ziyaretçileri cezbetmektedir.` : `${selSpot?.n} is one of the most recognized landmarks of the city. It attracts visitors with its magnificent view and historical significance.`)}
                  {selSpot?.t === 'palace' && (set.l === 'tr' ? `${selSpot?.n}, görkemli mimarisi ve zengin tarihiyle dikkat çeken bir saraydır. İçindeki değerli eserler ve bahçeleri görülmeye değerdir.` : `${selSpot?.n} is a palace notable for its magnificent architecture and rich history. The valuable artifacts inside and its gardens are worth seeing.`)}
                  {selSpot?.t === 'tower' && (set.l === 'tr' ? `${selSpot?.n}, şehrin panoramik manzarasını sunan tarihi bir kuledir. Ziyaretçiler tepeden muhteşem bir görünüm elde edebilir.` : `${selSpot?.n} is a historic tower offering panoramic views of the city. Visitors can get a magnificent view from the top.`)}
                  {selSpot?.t === 'street' && (set.l === 'tr' ? `${selSpot?.n}, canlı atmosferi, dükkanları ve restoranlarıyla ünlü popüler bir caddedir. Yürüyüş yapmak için ideal bir mekandır.` : `${selSpot?.n} is a popular street famous for its lively atmosphere, shops and restaurants. It's an ideal place for walking.`)}
                  {!['mosque', 'museum', 'market', 'landmark', 'palace', 'tower', 'street'].includes(selSpot?.t) && (set.l === 'tr' ? `${selSpot?.n}, bölgenin popüler turistik noktalarından biridir. Ziyaretçilere unutulmaz anılar sunan bu mekan, keşfedilmeye değer.` : `${selSpot?.n} is one of the popular tourist spots in the area. This place offers unforgettable memories to visitors and is worth exploring.`)}
                </Text>
              </View>
              <View style={[S.sdRevBox, { backgroundColor: th.c }]}>
                <Text style={[S.sdRevTitle, { color: th.t }]}>✍️ {L('writeReview')}</Text>
                <View style={S.sdStars}>{[1,2,3,4,5].map(s => <Btn key={s} onPress={() => setRevStar(s)}><Text style={[S.sdStar, s <= revStar && S.sdStarA]}>★</Text></Btn>)}</View>
                <TextInput style={[S.sdRevInp, { backgroundColor: th.bg, color: th.t, borderColor: th.b }]} placeholder={L('yourReview')} placeholderTextColor={th.t3} value={revTxt} onChangeText={setRevTxt} multiline numberOfLines={3} />
                <Btn style={[S.sdRevBtn, { backgroundColor: th.p }]} onPress={submitReview}><Text style={S.sdRevBtnT}>{L('save')}</Text></Btn>
              </View>
              <Btn style={[S.sdShowComments, { backgroundColor: th.c }]} onPress={() => setShowComments(!showComments)}>
                <Text style={[S.sdShowCommentsT, { color: th.p }]}>{showComments ? L('hideComments') : L('showComments')} ({spotReviews.length})</Text>
                <Text style={{ color: th.p, fontSize: 18 }}>{showComments ? '▲' : '▼'}</Text>
              </Btn>
              {showComments && <View style={S.sdComments}>
                {spotReviews.length === 0 ? <View style={[S.sdNoComments, { backgroundColor: th.c }]}><Text style={{ fontSize: 40, marginBottom: 12 }}>💬</Text><Text style={[S.sdNoCommentsT, { color: th.t }]}>{L('noComments')}</Text><Text style={[S.sdNoCommentsD, { color: th.t3 }]}>{L('beFirst')}</Text></View> : spotReviews.map((r, i) => <View key={i} style={[S.sdComment, { backgroundColor: th.c }]}>
                  <View style={S.sdCommentH}>
                    <View style={[S.sdCommentAv, { backgroundColor: th.p }]}><Text style={S.sdCommentAvT}>{(r.user_name || 'U')[0].toUpperCase()}</Text></View>
                    <View style={S.sdCommentInfo}><Text style={[S.sdCommentName, { color: th.t }]}>{r.user_name || 'User'}</Text><Text style={[S.sdCommentDate, { color: th.t3 }]}>{new Date(r.created_at).toLocaleDateString()}</Text></View>
                    <View style={S.sdCommentRating}>{[1,2,3,4,5].map(s => <Text key={s} style={[S.sdCommentStar, s <= r.rating && S.sdCommentStarA]}>★</Text>)}</View>
                  </View>
                  <Text style={[S.sdCommentTxt, { color: th.t }]}>{r.comment}</Text>
                </View>)}
              </View>}
            </>}
            <View style={{ height: 40 }} />
          </ScrollView>
        </SafeAreaView></Modal>
      </SafeAreaView>
    );
  }

  return (
    <View style={[S.c, { backgroundColor: th.bg }]}>
      <StatusBar barStyle={set.d ? 'light-content' : 'dark-content'} />
      <SafeAreaView style={{ flex: 1 }}>
        {/* Header */}
        <View style={S.hd2}>
          <View>
            <Text style={[S.hdTitle, { color: th.t }]}>{set.l === 'tr' ? 'Keşfet' : 'Explore'}</Text>
            <Text style={[S.hdSub, { color: th.t3 }]}>{set.l === 'tr' ? 'Hayalindeki yeri bul' : "Let's Explore Together"}</Text>
          </View>
          <Btn onPress={() => setProfM(true)}>
            <Image source={{ uri: `https://ui-avatars.com/api/?name=${u?.user_metadata?.display_name || u?.email}&background=${PRI.replace('#','')}&color=fff&size=100` }} style={S.hdAv} />
          </Btn>
        </View>

        <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
          {/* Stats Cards */}
          <View style={S.statsRow}>
            <View style={[S.statCard, { backgroundColor: th.c }]}>
              <Text style={S.statIcon}>🏆</Text>
              <Text style={[S.statVal, { color: th.p }]}>{pts}</Text>
              <Text style={[S.statLbl, { color: th.t3 }]}>{set.l === 'tr' ? 'Puan' : 'Points'}</Text>
            </View>
            <View style={[S.statCard, { backgroundColor: th.c }]}>
              <Text style={S.statIcon}>🗺️</Text>
              <Text style={[S.statVal, { color: th.t }]}>{trips.length}</Text>
              <Text style={[S.statLbl, { color: th.t3 }]}>{set.l === 'tr' ? 'Gezi' : 'Trips'}</Text>
            </View>
            <View style={[S.statCard, { backgroundColor: th.c }]}>
              <Text style={S.statIcon}>🌍</Text>
              <Text style={[S.statVal, { color: th.t }]}>{[...new Set(trips.flatMap(t => t.cities ? t.cities.map(c => c.n) : [t.city]))].length}</Text>
              <Text style={[S.statLbl, { color: th.t3 }]}>{set.l === 'tr' ? 'Şehir' : 'Cities'}</Text>
            </View>
            <View style={[S.statCard, { backgroundColor: th.c }]}>
              <Text style={S.statIcon}>{getRank(pts).icon}</Text>
              <Text style={[S.statVal, { color: th.t, fontSize: 14 }]}>{set.l === 'tr' ? getRank(pts).name.tr : getRank(pts).name.en}</Text>
              <Text style={[S.statLbl, { color: th.t3 }]}>{set.l === 'tr' ? 'Seviye' : 'Rank'}</Text>
            </View>
          </View>

          {/* Create Trip Button - Tek büyük buton */}
          <Btn style={S.aiBtn} onPress={() => setBudgetM(true)}>
            <LinearGradient colors={th.g} style={S.aiBtnGrad} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}>
              <View style={S.aiBtnLeft}>
                <Text style={S.aiBtnIcon}>✨</Text>
                <View>
                  <Text style={S.aiBtnTitle}>{set.l === 'tr' ? 'AI ile Rota Oluştur' : 'Create Trip with AI'}</Text>
                  <Text style={S.aiBtnDesc}>{set.l === 'tr' ? 'Akıllı seyahat planla' : 'Smart travel planning'}</Text>
                </View>
              </View>
              <View style={S.aiBtnArrow}><Text style={S.aiBtnArrowT}>→</Text></View>
            </LinearGradient>
          </Btn>

          {/* Manuel Oluştur Butonu */}
          <Btn style={S.manualBtn} onPress={() => setCityM(true)}>
            <View style={[S.manualBtnInner, { backgroundColor: th.c }]}>
              <View style={S.manualBtnLeft}>
                <Text style={S.manualBtnIcon}>🛠️</Text>
                <View>
                  <Text style={[S.manualBtnTitle, { color: th.t }]}>{set.l === 'tr' ? 'Manuel Oluştur' : 'Create Manually'}</Text>
                  <Text style={[S.manualBtnDesc, { color: th.t3 }]}>{set.l === 'tr' ? 'Kendi rotanı kendin yap' : 'Build your own itinerary'}</Text>
                </View>
              </View>
              <Text style={{ color: th.p, fontSize: 18 }}>→</Text>
            </View>
          </Btn>

          <View style={{ height: 24 }} />

          {/* Popular Destinations */}
          <View style={S.popSec}>
            <View style={S.popHead}>
              <Text style={[S.popTitle, { color: th.t }]}>{set.l === 'tr' ? 'Popüler Destinasyonlar' : 'Popular Destinations'}</Text>
              <Btn onPress={() => setAllDestM(true)}><Text style={[S.popAll, { color: th.p }]}>{set.l === 'tr' ? 'Hepsini Gör' : 'View All'}</Text></Btn>
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={S.popList}>
              {CITIES.map(c => (
                <Btn key={c.id} style={[S.popCard, { backgroundColor: th.c }]} onPress={() => { const prebuilt = PREBUILT_TRIPS[c.id]; if (prebuilt) { const newTrip = { ...prebuilt, id: Date.now() }; setTrip(newTrip); setUnsavedTrip(newTrip); setSday(1); setScr('detail'); } }}>
                  <CityPhoto cityName={c.n} countryName={c.c} fallbackImg={c.img} style={S.popImg} />
                  <View style={[S.popInfo, { backgroundColor: th.c }]}>
                    <Text style={[S.popName, { color: th.t }]}>{c.n}</Text>
                    <View style={S.popLoc}>
                      <Text style={S.popPin}>📍</Text>
                      <Text style={[S.popCountry, { color: th.t3 }]}>{c.c}</Text>
                    </View>
                  </View>
                </Btn>
              ))}
            </ScrollView>
          </View>

          {/* My Trips */}
          <View style={S.tripsSec}>
            <Text style={[S.tripsTitle, { color: th.t }]}>{L('trips')}</Text>
            {trips.length === 0 ? (
              <View style={[S.emptyTrips, { backgroundColor: th.c }]}>
                <Text style={S.emptyIcon}>✈️</Text>
                <Text style={[S.emptyTitle, { color: th.t }]}>{L('noTrip')}</Text>
                <Text style={[S.emptyDesc, { color: th.t3 }]}>{L('first')}</Text>
              </View>
            ) : trips.map((tr, i) => (
              <Btn key={tr.id || i} style={[S.tripCard, { backgroundColor: th.c }]} onPress={() => { setTrip(tr); setSday(1); setScr('detail'); }}>
                <View style={S.tripLeft}>
                  <View style={[S.tripFlag, { backgroundColor: th.p + '15' }]}><Text style={S.tripFlagT}>{tr.flag && tr.flag.length <= 4 ? tr.flag : (tr.code ? getFlag(tr.code) : '🌍')}</Text></View>
                  <View style={S.tripInfo}>
                    <Text style={[S.tripName, { color: th.t }]}>{tr.city}</Text>
                    <Text style={[S.tripMeta, { color: th.t3 }]}>{tr.days} {L('days')}{tr.ai && ' • ✨ AI'}{tr.budget && ' • 🎒'}</Text>
                  </View>
                </View>
                <View style={S.tripRight}>
                  <HapticBtn style={S.tripDel} onPress={() => { setDelT(tr); setDelM(true); }} type="warning"><Text>🗑️</Text></HapticBtn>
                  <Text style={{ color: th.t3, fontSize: 22 }}>›</Text>
                </View>
              </Btn>
            ))}
          </View>
        </ScrollView>

        {/* Floating Bottom Tab */}
        <View style={[S.tabBar, { backgroundColor: SEC }]}>
          <Btn style={S.tabItem} onPress={() => { loadLeaderboard(); setLbM(true); }}><Text style={S.tabIcon}>🏆</Text></Btn>
          <Btn style={S.tabItemCenter} onPress={() => setFabM(true)}>
            <LinearGradient colors={th.g} style={S.tabAdd}><Text style={S.tabAddIcon}>+</Text></LinearGradient>
          </Btn>
          <Btn style={S.tabItem} onPress={() => setProfM(true)}><Text style={S.tabIcon}>👤</Text></Btn>
        </View>
      </SafeAreaView>

      {/* All Destinations Modal */}
      <Modal visible={allDestM} animationType="slide"><SafeAreaView style={[S.fm, { backgroundColor: th.bg }]}>
        <View style={S.modalHead}>
          <Btn onPress={() => setAllDestM(false)} style={S.modalBack}><Text style={[S.modalBackT, { color: th.t }]}>←</Text></Btn>
          <Text style={[S.modalTitle, { color: th.t }]}>🌍 {set.l === 'tr' ? 'Popüler Destinasyonlar' : 'Popular Destinations'}</Text>
          <View style={{ width: 40 }} />
        </View>
        <ScrollView style={{ flex: 1, padding: 16 }} showsVerticalScrollIndicator={false}>
          <View style={S.allDestGrid}>
            {CITIES.map(c => (
              <Btn key={c.id} style={[S.allDestCard, { backgroundColor: th.c }]} onPress={() => {
                const prebuilt = PREBUILT_TRIPS[c.id];
                if (prebuilt) {
                  const newTrip = { ...prebuilt, id: Date.now() };
                  setTrip(newTrip);
                  setUnsavedTrip(newTrip);
                  setSday(1);
                  setAllDestM(false);
                  setScr('detail');
                }
              }}>
                <CityPhoto cityName={c.n} countryName={c.c} fallbackImg={c.img} style={S.allDestImg} />
                <View style={S.allDestInfo}>
                  <Text style={S.allDestFlag}>{c.f}</Text>
                  <Text style={[S.allDestName, { color: th.t }]}>{c.n}</Text>
                  <Text style={[S.allDestCountry, { color: th.t3 }]}>{c.c}</Text>
                </View>
              </Btn>
            ))}
          </View>
        </ScrollView>
      </SafeAreaView></Modal>

      {/* Budget Travel Modal */}
      {/* Step 1: Şehir Seçimi */}
      <Modal visible={budgetM} animationType="slide"><SafeAreaView style={[S.fm, { backgroundColor: th.bg }]}>
        <View style={S.modalHead}>
          <Btn onPress={() => { setBudgetM(false); setBudgetCity(null); setBudgetStep(1); }} style={S.modalBack}><Text style={[S.modalBackT, { color: th.t }]}>←</Text></Btn>
          <Text style={[S.modalTitle, { color: th.t }]}>✈️ {set.l === 'tr' ? 'Rota Oluştur' : 'Create Trip'}</Text>
          <View style={{ width: 40 }} />
        </View>
        <ScrollView style={{ flex: 1, padding: 20 }} showsVerticalScrollIndicator={false}>
          {/* Şehir seçimi */}
          <Text style={[S.budgetLabel, { color: th.t }]}>{set.l === 'tr' ? '📍 Şehir Seç' : '📍 Select City'}</Text>
          {budgetCity ? (
            <View style={[S.budgetCitySelected, { backgroundColor: th.c }]}>
              <Text style={S.budgetCityFlag}>{budgetCity.f}</Text>
              <Text style={[S.budgetCityName, { color: th.t }]}>{budgetCity.n}</Text>
              <Btn onPress={() => setBudgetCity(null)}><Text style={{ color: '#ef5350' }}>✕</Text></Btn>
            </View>
          ) : (
            <View>
              {/* Search Bar */}
              <View style={[S.csb, { backgroundColor: th.c, borderColor: th.b, marginBottom: 12 }]}>
                <Text style={S.csi}>🔍</Text>
                <TextInput 
                  style={[S.csin, { color: th.t }]} 
                  placeholder={set.l === 'tr' ? 'Şehir ara...' : 'Search city...'} 
                  placeholderTextColor={th.t3} 
                  value={cq} 
                  onChangeText={t => { setCq(t); searchC(t); }} 
                />
                {cl && <ActivityIndicator color={th.p} />}
              </View>
              {/* Search Results */}
              {cr.length > 0 ? (
                <View style={{ maxHeight: 200 }}>
                  <ScrollView nestedScrollEnabled>
                    {cr.map(c => (
                      <Btn key={c.id} style={[S.cri, { backgroundColor: th.c }]} onPress={async () => {
                        setCl(true);
                        try {
                          const r = await fetch(`https://maps.googleapis.com/maps/api/place/details/json?place_id=${c.id}&fields=geometry,address_components&key=${GAPI}`);
                          const d = await r.json();
                          if (d.result) {
                            const cc = d.result.address_components?.find(x => x.types.includes('country'));
                            const countryCode = cc?.short_name || '';
                            const flag = getFlag(countryCode);
                            setBudgetCity({ n: c.n, f: flag, lat: d.result.geometry.location.lat, lng: d.result.geometry.location.lng, c: cc?.long_name || '' });
                            setCq(''); setCr([]);
                          }
                        } catch (e) {} finally { setCl(false); }
                      }}>
                        <Text style={S.cric}>📍</Text>
                        <View style={S.crif}>
                          <Text style={[S.crin, { color: th.t }]}>{c.n}</Text>
                          <Text style={[S.crifl, { color: th.t3 }]}>{c.f}</Text>
                        </View>
                        <Text style={{ color: th.p }}>→</Text>
                      </Btn>
                    ))}
                  </ScrollView>
                </View>
              ) : (
                <View>
                  <Text style={[S.budgetPopLabel, { color: th.t3 }]}>{set.l === 'tr' ? 'Popüler' : 'Popular'}</Text>
                  <View style={S.budgetCityList}>
                    {CITIES.slice(0, 6).map(c => (
                      <Btn key={c.id} style={[S.budgetCityItem, { backgroundColor: th.c }]} onPress={() => setBudgetCity({ n: c.n, c: c.c, f: c.f, lat: c.lat, lng: c.lng })}>
                        <Text style={S.budgetCityItemF}>{c.f}</Text>
                        <Text style={[S.budgetCityItemN, { color: th.t }]}>{c.n}</Text>
                      </Btn>
                    ))}
                  </View>
                </View>
              )}
            </View>
          )}
        </ScrollView>
        
        <View style={[S.budgetFooter, { backgroundColor: th.c, borderTopColor: th.b }]}>
          <HapticBtn style={[S.budgetGenBtn, !budgetCity && { opacity: 0.5 }]} onPress={() => { setBudgetM(false); setDayPickerM(true); }} disabled={!budgetCity} type="light">
            <LinearGradient colors={th.g} style={S.budgetGenBtnGrad}>
              <Text style={S.budgetGenBtnT}>{set.l === 'tr' ? 'Devam' : 'Continue'} →</Text>
            </LinearGradient>
          </HapticBtn>
        </View>
      </SafeAreaView></Modal>

      {/* Step 2: Gün Seçimi - Basit picker */}
      <Modal visible={dayPickerM} animationType="slide"><SafeAreaView style={[S.fm, { backgroundColor: th.bg }]}>
        <View style={S.modalHead}>
          <Btn onPress={() => { setDayPickerM(false); setBudgetM(true); }} style={S.modalBack}><Text style={[S.modalBackT, { color: th.t }]}>←</Text></Btn>
          <View style={{ width: 40 }} />
        </View>
        <View style={S.dayPickerContainer}>
          <Text style={[S.dayPickerTitle, { color: th.t }]}>{set.l === 'tr' ? 'Kaç gün?' : 'How many days?'}</Text>
          <ScrollView 
            style={S.dayPickerScrollWrap}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={S.dayPickerScrollContent}
          >
            {[1,2,3,4,5,6,7,8,9,10,11,12,13,14].map(d => (
              <Btn key={d} style={[S.dayPickerItem, budgetDays === d && S.dayPickerItemActive]} onPress={() => setBudgetDays(d)}>
                <Text style={[S.dayPickerNum, { color: th.t3 }, budgetDays === d && { color: th.t, fontSize: 48, fontWeight: '700' }]}>{d}</Text>
              </Btn>
            ))}
          </ScrollView>
          <Text style={[S.dayPickerLabel, { color: th.t3 }]}>{set.l === 'tr' ? 'gün' : 'days'}</Text>
        </View>
        
        <View style={[S.budgetFooter, { backgroundColor: th.c, borderTopColor: th.b }]}>
          <HapticBtn style={S.budgetGenBtn} onPress={() => { setDayPickerM(false); setBudgetStep(2); setPrefM(true); }} type="light">
            <LinearGradient colors={th.g} style={S.budgetGenBtnGrad}>
              <Text style={S.budgetGenBtnT}>{set.l === 'tr' ? 'Devam' : 'Continue'} →</Text>
            </LinearGradient>
          </HapticBtn>
        </View>
      </SafeAreaView></Modal>

      <Modal visible={cityM} animationType="slide"><SafeAreaView style={[S.fm, { backgroundColor: th.bg }]}><View style={S.modalHead}><Btn onPress={() => { setCityM(false); setCq(''); setCr([]); }} style={S.modalBack}><Text style={[S.modalBackT, { color: th.t }]}>←</Text></Btn><Text style={[S.modalTitle, { color: th.t }]}>{L('city')}</Text><View style={{ width: 40 }} /></View><View style={S.mct}><View style={[S.csb, { backgroundColor: th.c, borderColor: th.b }]}><Text style={S.csi}>🔍</Text><TextInput style={[S.csin, { color: th.t }]} placeholder={L('search')} placeholderTextColor={th.t3} value={cq} onChangeText={t => { setCq(t); searchC(t); }} autoFocus />{cl && <ActivityIndicator color={th.p} />}</View><ScrollView showsVerticalScrollIndicator={false}>{cr.map(c => <Btn key={c.id} style={[S.cri, { backgroundColor: th.c }]} onPress={() => pickC(c)}><Text style={S.cric}>📍</Text><View style={S.crif}><Text style={[S.crin, { color: th.t }]}>{c.n}</Text><Text style={[S.crifl, { color: th.t3 }]}>{c.f}</Text></View><Text style={{ color: th.p }}>→</Text></Btn>)}{cq.length < 2 && <View style={S.qp}><Text style={[S.qpt, { color: th.t3 }]}>{L('pop')}</Text>{CITIES.slice(0, 6).map(c => <Btn key={c.id} style={[S.cri, { backgroundColor: th.c }]} onPress={() => { setCity({ n: c.n, c: c.c, f: c.f, lat: c.lat, lng: c.lng, code: '' }); setCityM(false); setDayM(true); }}><Text style={S.cric}>{c.f}</Text><View style={S.crif}><Text style={[S.crin, { color: th.t }]}>{c.n}</Text><Text style={[S.crifl, { color: th.t3 }]}>{c.c}</Text></View><Text style={{ color: th.p }}>→</Text></Btn>)}</View>}</ScrollView></View></SafeAreaView></Modal>

      <Modal visible={dayM} animationType="slide" transparent><View style={S.mo}><View style={[S.bs, { backgroundColor: th.c, maxHeight: '85%' }]}><View style={S.bsh} /><Btn style={S.bsClose} onPress={() => { setDayM(false); setCities([]); }}><Text style={[S.bsCloseT, { color: th.t3 }]}>✕</Text></Btn><ScrollView showsVerticalScrollIndicator={false}>
        {/* Eklenen şehirler */}
        {cities.length > 0 && <View style={S.mcList}>
          <Text style={[S.mcListT, { color: th.t }]}>🗺️ {set.l === 'tr' ? 'Rotanız' : 'Your Route'}</Text>
          {cities.map((c, i) => <View key={i} style={[S.mcItem, { backgroundColor: th.bg }]}>
            <Text style={S.mcItemF}>{c.f}</Text>
            <View style={S.mcItemInfo}><Text style={[S.mcItemN, { color: th.t }]}>{c.n}</Text><Text style={[S.mcItemD, { color: th.t3 }]}>{c.days} {L('day')}</Text></View>
            <Btn onPress={() => setCities(cities.filter((_, idx) => idx !== i))}><Text style={{ color: '#ef5350', fontSize: 18 }}>✕</Text></Btn>
          </View>)}
          <View style={[S.mcTotal, { borderTopColor: th.b }]}><Text style={[S.mcTotalT, { color: th.t3 }]}>{set.l === 'tr' ? 'Toplam' : 'Total'}: {cities.reduce((a, c) => a + c.days, 0)} {L('day')}</Text></View>
        </View>}
        
        {/* Yeni şehir ekleme */}
        <Text style={[S.bst, { color: th.t }]}>📅 {cities.length > 0 ? (set.l === 'tr' ? 'Şehir Ekle' : 'Add City') : L('howMany')}</Text>
        {city && <Text style={[S.bsst, { color: th.t3 }]}>{city.f} {city.n}</Text>}
        <View style={S.dpc}><ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={S.dps}>{[1,2,3,4,5,6,7].map(d => <Btn key={d} style={[S.dpi, { borderColor: th.b, backgroundColor: th.bg }, days === d && { backgroundColor: th.p, borderColor: th.p }]} onPress={() => setDays(d)}><Text style={[S.dpn, { color: th.t }, days === d && { color: '#fff' }]}>{d}</Text><Text style={[S.dpl, { color: th.t3 }, days === d && { color: 'rgba(255,255,255,0.8)' }]}>{L('day')}</Text></Btn>)}</ScrollView></View>
        
        {/* Şehir ekle butonu */}
        <Btn style={[S.addCityBtn, { borderColor: th.p }]} onPress={() => {
          if (city) {
            setCities([...cities, { ...city, days }]);
            setCity(null);
            setCityM(true);
            setDayM(false);
          }
        }}><Text style={[S.addCityBtnT, { color: th.p }]}>+ {set.l === 'tr' ? 'Başka Şehir Ekle' : 'Add Another City'}</Text></Btn>
        
        {/* Devam butonu - Manuel oluşturma için direkt manM'e git */}
        <Btn style={S.ctb} onPress={() => { 
          if (city) setCities([...cities, { ...city, days }]);
          setDayM(false); 
          setManM(true);
          setSpots([]);
          setCat(null);
          setCatP([]);
        }}><LinearGradient colors={th.g} style={S.ctbg}><Text style={S.ctbt}>{L('cont')}</Text><Text style={S.ctba}>→</Text></LinearGradient></Btn>
      </ScrollView></View></View></Modal>

      <Modal visible={planM} animationType="slide" transparent><View style={S.mo}><View style={[S.cfs, { backgroundColor: th.c, maxHeight: '80%' }]}><View style={S.bsh} /><Btn style={S.bsClose} onPress={() => setPlanM(false)}><Text style={[S.bsCloseT, { color: th.t3 }]}>✕</Text></Btn><ScrollView showsVerticalScrollIndicator={false}><View style={S.pcc}><Text style={S.pci}>🤔</Text><Text style={[S.pct, { color: th.t }]}>{L('plan')}</Text><View style={S.pcbs}><Btn style={S.pcb} onPress={() => { setPlanM(false); setPrefM(true); }}><LinearGradient colors={th.g} style={S.pcbg}><Text style={S.pcbt}>{L('yes')}</Text></LinearGradient></Btn><Btn style={[S.pcbo, { borderColor: th.b }]} onPress={() => { setPlanM(false); setManM(true); setSpots([]); setCat(null); setCatP([]); }}><Text style={[S.pcbot, { color: th.t }]}>{L('no')}</Text></Btn></View></View></ScrollView></View></View></Modal>

      <Modal visible={prefM} animationType="slide"><SafeAreaView style={[S.fm, { backgroundColor: th.bg }]}>
        <LinearGradient colors={th.g} style={S.mh}>
          <Btn onPress={() => { setPrefM(false); setPrf([]); setDayPickerM(true); }} style={S.mcb}><Text style={S.mcbt}>←</Text></Btn>
          <Text style={S.mt}>{L('prefs')}</Text>
          <View style={{ width: 40 }} />
        </LinearGradient>
        <ScrollView style={S.prc} showsVerticalScrollIndicator={false}>
          {/* Seçilen şehir ve gün bilgisi */}
          {budgetCity && (
            <View style={[S.prefSummary, { backgroundColor: th.c }]}>
              <Text style={S.prefSummaryF}>{budgetCity.f}</Text>
              <View>
                <Text style={[S.prefSummaryN, { color: th.t }]}>{budgetCity.n}</Text>
                <Text style={[S.prefSummaryD, { color: th.t3 }]}>{budgetDays} {set.l === 'tr' ? 'gün' : 'days'}</Text>
              </View>
            </View>
          )}
          
          {/* Bütçe Slider */}
          <Text style={[S.budgetLabel, { color: th.t, marginBottom: 12 }]}>💰 {set.l === 'tr' ? 'Bütçe' : 'Budget'}</Text>
          <View style={[S.budgetSliderBox, { backgroundColor: th.c, marginBottom: 24 }]}>
            <Text style={[S.budgetAmount, { color: budget > 1000 ? th.p : '#4CAF50' }]}>
              {budget > 1000 ? (set.l === 'tr' ? '∞ Sınırsız' : '∞ Unlimited') : `$${budget}`}
            </Text>
            <View style={S.budgetSliderRow}>
              <Text style={[S.budgetMinMax, { color: th.t3 }]}>$50</Text>
              <Slider
                style={{ flex: 1, height: 40 }}
                minimumValue={50}
                maximumValue={1050}
                step={50}
                value={budget}
                onValueChange={(v) => setBudget(v)}
                minimumTrackTintColor={budget > 1000 ? th.p : '#4CAF50'}
                maximumTrackTintColor={th.b}
                thumbTintColor={budget > 1000 ? th.p : '#4CAF50'}
              />
              <Text style={[S.budgetMinMax, { color: th.t3 }]}>∞</Text>
            </View>
            <View style={S.budgetBtns}>
              {[100, 300, 500, 750, 1050].map(v => (
                <Btn key={v} style={[S.budgetQuick, { backgroundColor: budget === v ? (v > 1000 ? th.p : '#4CAF50') : th.bg }]} onPress={() => setBudget(v)}>
                  <Text style={[S.budgetQuickT, { color: budget === v ? '#fff' : th.t }]}>{v > 1000 ? '∞' : `$${v}`}</Text>
                </Btn>
              ))}
            </View>
          </View>
          
          {/* Tercihler */}
          <Text style={[S.budgetLabel, { color: th.t, marginBottom: 8 }]}>🎯 {L('prefs')}</Text>
          <Text style={[S.prst, { color: th.t3 }]}>{L('min3')}</Text>
          <View style={S.prg}>
            {PREFS.map(p => (
              <Btn key={p.id} style={[S.pch, { borderColor: th.b, backgroundColor: th.c }, prf.includes(p.id) && { backgroundColor: th.p, borderColor: th.p }]} onPress={() => prf.includes(p.id) ? setPrf(prf.filter(x => x !== p.id)) : setPrf([...prf, p.id])}>
                <Text style={S.pchi}>{p.i}</Text>
                <Text style={[S.pchl, { color: th.t }, prf.includes(p.id) && { color: '#fff' }]}>{set.l === 'tr' ? p.tr : p.en}</Text>
              </Btn>
            ))}
          </View>
        </ScrollView>
        <View style={[S.prf, { backgroundColor: th.c, borderTopColor: th.b }]}>
          <HapticBtn style={[S.gnb, prf.length < 3 && { opacity: 0.5 }]} onPress={genTripWithBudget} disabled={prf.length < 3 || gen} type="success">
            <LinearGradient colors={th.g} style={S.gnbg}>{gen ? <ActivityIndicator color="#fff" /> : <Text style={S.gnbt}>✨ {set.l === 'tr' ? 'Rota Oluştur' : 'Create Trip'}</Text>}</LinearGradient>
          </HapticBtn>
        </View>
      </SafeAreaView></Modal>

      <Modal visible={manM} animationType="slide"><SafeAreaView style={[S.fm, { backgroundColor: th.bg }]}><LinearGradient colors={th.g} style={S.mh}><Btn onPress={() => { setManM(false); setSpots([]); }} style={S.mcb}><Text style={S.mcbt}>←</Text></Btn><Text style={S.mt}>{set.l === 'tr' ? 'Manuel' : 'Manual'}</Text><View style={{ width: 40 }} /></LinearGradient><ScrollView style={S.mnc}><Text style={[S.mnst, { color: th.t }]}>{L('selDay')}</Text><ScrollView horizontal showsHorizontalScrollIndicator={false} style={S.mnds}>{[...Array(days)].map((_, i) => <Btn key={i} style={[S.mndb, { borderColor: th.b, backgroundColor: th.c }, mday === i + 1 && { backgroundColor: COLORS[i], borderColor: COLORS[i] }]} onPress={() => setMday(i + 1)}><Text style={[S.mndbt, { color: th.t }, mday === i + 1 && { color: '#fff' }]}>{L('day')} {i + 1}</Text></Btn>)}</ScrollView><Text style={[S.mnst, { color: th.t }]}>{L('selCat')}</Text><ScrollView horizontal showsHorizontalScrollIndicator={false} style={S.cats}>{CATS.map(c => <Btn key={c.id} style={[S.cach, { borderColor: th.b, backgroundColor: th.c }, cat?.id === c.id && { backgroundColor: th.p, borderColor: th.p }]} onPress={() => searchCat(c)}><Text style={S.cachi}>{c.i}</Text><Text style={[S.cachl, { color: th.t }, cat?.id === c.id && { color: '#fff' }]}>{set.l === 'tr' ? c.tr : c.en}</Text></Btn>)}</ScrollView>{spots.filter(x => x.day === mday).length > 0 && <View style={[S.addedBar, { backgroundColor: th.p + '15' }]}><Text style={[S.addedBarT, { color: th.p }]}>{L('day')} {mday}: {spots.filter(x => x.day === mday).map(x => x.n.slice(0,15)).join(', ')}</Text></View>}{catL ? <ActivityIndicator color={th.p} style={{ marginVertical: 20 }} /> : catP.length > 0 && <View style={S.capl}>{catP.map(p => { const isAdded = spots.find(x => x.id === p.id); return <View key={p.id} style={[S.capi, { backgroundColor: th.c }, isAdded && { opacity: 0.5 }]}>{p.img && <Image source={{ uri: p.img }} style={S.capimg} />}<View style={S.capinf}><Text style={[S.capn, { color: th.t }]} numberOfLines={1}>{p.n}</Text><Text style={[S.capa, { color: th.t3 }]} numberOfLines={1}>{p.a}</Text>{p.r > 0 && <Text style={[S.capr, { color: th.t2 }]}>⭐ {p.r.toFixed(1)}</Text>}</View>{isAdded ? <View style={[S.addedBdg, { backgroundColor: '#4CAF50' }]}><Text style={S.addedBdgT}>✓</Text></View> : <Btn style={[S.adpb, { backgroundColor: th.p }]} onPress={() => addS(p, mday)}><Text style={S.adpbt}>+</Text></Btn>}</View>; })}</View>}{spots.length > 0 && <View style={S.ads}><Text style={[S.mnst, { color: th.t }]}>{L('added')} ({spots.length})</Text>{[...Array(days)].map((_, di) => { const ds = spots.filter(s => s.day === di + 1); if (ds.length === 0) return null; return <View key={di} style={S.addg}><Text style={[S.addl, { color: COLORS[di] }]}>{L('day')} {di + 1}</Text>{ds.map((sp, idx) => <View key={sp.id} style={[S.adsi, { backgroundColor: th.c }]}><View style={[S.adsb, { backgroundColor: COLORS[di] }]}><Text style={S.adsbt}>{idx + 1}</Text></View><Text style={[S.adsn, { color: th.t }]} numberOfLines={1}>{sp.n}</Text><Btn onPress={() => remS(sp.id)}><Text style={{ color: '#ef5350', fontSize: 16 }}>✕</Text></Btn></View>)}</View>; })}</View>}</ScrollView><View style={[S.mnf, { backgroundColor: th.c, borderTopColor: th.b }]}><HapticBtn style={[S.svb, spots.length === 0 && { opacity: 0.5 }]} onPress={saveMan} disabled={spots.length === 0 || gen} type="success"><LinearGradient colors={th.g} style={S.svbg}>{gen ? <ActivityIndicator color="#fff" /> : <Text style={S.svbt}>💾 {L('save')}</Text>}</LinearGradient></HapticBtn></View></SafeAreaView></Modal>

      <Modal visible={delM} animationType="fade" transparent><View style={S.mo}><View style={[S.cm, { backgroundColor: th.c }]}><Text style={S.ci}>🗑️</Text><Text style={[S.ct, { color: th.t }]}>{L('del')}</Text><Text style={[S.cd, { color: th.t3 }]}>{L('sure')}</Text><View style={S.cbs}><Btn style={[S.cb, { backgroundColor: th.b }]} onPress={() => { setDelM(false); setDelT(null); }}><Text style={[S.cbt, { color: th.t }]}>{L('cancel')}</Text></Btn><HapticBtn style={[S.cb, { backgroundColor: '#ef5350' }]} onPress={() => delTr(delT)} type="error"><Text style={[S.cbt, { color: '#fff' }]}>{L('del')}</Text></HapticBtn></View></View></View></Modal>

      <Modal visible={profM} animationType="slide" transparent><View style={S.mo}><View style={[S.pfm, { backgroundColor: th.bg }]}><LinearGradient colors={th.g} style={S.pfh}><Btn style={S.clb} onPress={() => setProfM(false)}><Text style={S.clbt}>✕</Text></Btn><View style={S.pfinf}><View style={S.pfavl}><Text style={S.pfavlt}>{(u?.user_metadata?.display_name || u?.email)?.[0]?.toUpperCase()}</Text></View><Text style={S.pfnm}>{u?.user_metadata?.display_name || u?.email?.split('@')[0]}</Text><Text style={S.pfem}>{u?.email}</Text><View style={S.rkBdg}><Text style={S.rkBdgI}>{getRank(pts).icon}</Text><Text style={S.rkBdgT}>{set.l === 'tr' ? getRank(pts).name.tr : getRank(pts).name.en}</Text></View></View><View style={S.ptsb}><Text style={S.ptsbv}>{pts}</Text><Text style={S.ptsbl}>{set.l === 'tr' ? 'Toplam Puan' : 'Total Points'}</Text></View></LinearGradient><ScrollView style={S.pfcnt}><View style={[S.stsec, { backgroundColor: th.c }]}><Text style={[S.stsect, { color: th.t }]}>⚙️ {set.l === 'tr' ? 'Ayarlar' : 'Settings'}</Text><View style={S.sti}><Text style={[S.stl, { color: th.t }]}>{L('dark')}</Text><Switch value={set.d} onValueChange={v => saveS({ ...set, d: v })} trackColor={{ false: '#ddd', true: th.p }} thumbColor="#fff" /></View><TouchableOpacity style={S.sti} onPress={() => saveS({ ...set, l: set.l === 'tr' ? 'en' : 'tr' })}><Text style={[S.stl, { color: th.t }]}>{L('lang')}</Text><Text style={[S.stv, { color: th.p }]}>{set.l === 'tr' ? '🇹🇷 Türkçe' : '🇬🇧 English'}</Text></TouchableOpacity></View><View style={[S.stsec, { backgroundColor: th.c }]}><Text style={[S.stsect, { color: th.t }]}>💬 {L('supTitle')}</Text><Text style={[S.supDesc, { color: th.t3 }]}>{L('supDesc')}</Text><Btn style={[S.supBtn, { borderColor: th.b }]} onPress={openSupport}><Text style={S.supBtnI}>📧</Text><Text style={[S.supBtnT, { color: th.t }]}>{L('supEmail')}</Text></Btn></View><View style={[S.stsec, { backgroundColor: th.c }]}><Text style={[S.stsect, { color: th.t }]}>🗑️ {set.l === 'tr' ? 'Veri' : 'Data'}</Text><Btn style={[S.delAllBtn, { backgroundColor: '#ffebee' }]} onPress={() => Alert.alert(set.l === 'tr' ? 'Tüm Gezileri Sil' : 'Delete All Trips', set.l === 'tr' ? 'Tüm gezilerin silinecek. Emin misin?' : 'All trips will be deleted. Are you sure?', [{ text: L('cancel'), style: 'cancel' }, { text: L('del'), style: 'destructive', onPress: async () => { try { await supabase.from('trips').delete().eq('user_id', u.id); setTrips([]); Alert.alert('✅', set.l === 'tr' ? 'Tüm geziler silindi' : 'All trips deleted'); } catch(e) {} }}])}><Text style={S.delAllBtnI}>🗑️</Text><Text style={S.delAllBtnT}>{set.l === 'tr' ? 'Tüm Gezileri Sil' : 'Delete All Trips'}</Text></Btn></View><TouchableOpacity style={S.lgb} onPress={logout}><Text style={S.lgbt}>🚪 {L('out')}</Text></TouchableOpacity><View style={{ height: 50 }} /></ScrollView></View></View></Modal>

      <Modal visible={genM} animationType="fade" transparent><View style={S.genMO}><View style={[S.genMC, { backgroundColor: th.c }]}><ActivityIndicator size="large" color={th.p} /><Text style={[S.genMT, { color: th.t }]}>{L('creating')}</Text><Text style={[S.genMS, { color: th.t3 }]}>{city?.n || ''}</Text><View style={S.genMB}><View style={[S.genMBP, { backgroundColor: th.p }]} /></View></View></View></Modal>

      {/* FAB Menu Modal - Real Blur Background */}
      <Modal visible={fabM} animationType="fade" transparent>
        <View style={S.fabFullOverlay}>
          {/* Blur Background */}
          <BlurView intensity={80} tint={set.d ? 'dark' : 'light'} style={StyleSheet.absoluteFill} />
          
          {/* Touch area to close */}
          <Btn style={S.fabTouchArea} onPress={() => setFabM(false)} activeOpacity={1}>
            <View style={S.fabContentBottom}>
              {/* AI Trip Option */}
              <Btn style={S.fabOption} onPress={() => { setFabM(false); setBudgetM(true); }}>
                <BlurView intensity={100} tint="dark" style={S.fabOptionBlur}>
                  <View style={S.fabOptionContent}>
                    <Text style={S.fabOptionTitle}>{set.l === 'tr' ? 'AI ile Oluştur' : 'Create with AI'}</Text>
                    <Text style={S.fabOptionEmoji}>✨🗺️</Text>
                  </View>
                </BlurView>
              </Btn>
              
              {/* Manual Trip Option */}
              <Btn style={S.fabOption} onPress={() => { setFabM(false); setCityM(true); }}>
                <BlurView intensity={100} tint="light" style={S.fabOptionBlur}>
                  <View style={S.fabOptionContent}>
                    <Text style={S.fabOptionTitleDark}>{set.l === 'tr' ? 'Manuel Oluştur' : 'Build Manually'}</Text>
                    <Text style={S.fabOptionEmoji}>🛠️📍</Text>
                  </View>
                </BlurView>
              </Btn>
            </View>
          </Btn>
          
          {/* X Button - Above blur, same position as + */}
          <View style={S.fabXContainer}>
            <Btn onPress={() => setFabM(false)}>
              <View style={[S.fabXBtn, { backgroundColor: th.p }]}>
                <Text style={S.fabXIcon}>✕</Text>
              </View>
            </Btn>
          </View>
        </View>
      </Modal>

      <Modal visible={lbM} animationType="slide" transparent><View style={S.mo}><View style={[S.lbMC, { backgroundColor: th.bg }]}>
        <View style={S.lbMH}><Text style={[S.lbMHT, { color: th.t }]}>🏆 {L('leaderboard')}</Text><Btn onPress={() => setLbM(false)}><Text style={{ fontSize: 24, color: th.t3 }}>✕</Text></Btn></View>
        {myMonthly && <View style={[S.lbMyStats, { backgroundColor: th.c }]}>
          <Text style={[S.lbMyTitle, { color: th.t }]}>📊 {L('monthly')}</Text>
          <View style={S.lbMyRow}>
            <View style={S.lbMyStat}><Text style={[S.lbMyVal, { color: th.p }]}>{myMonthly.points}</Text><Text style={[S.lbMyLbl, { color: th.t3 }]}>{L('monthlyPts')}</Text></View>
            <View style={S.lbMyStat}><Text style={[S.lbMyVal, { color: th.t }]}>{myMonthly.max_reviews - myMonthly.review_count}</Text><Text style={[S.lbMyLbl, { color: th.t3 }]}>{L('reviewsLeft')}</Text></View>
            <View style={S.lbMyStat}><Text style={[S.lbMyVal, { color: th.t }]}>{myMonthly.max_trips - myMonthly.trip_count}</Text><Text style={[S.lbMyLbl, { color: th.t3 }]}>{L('tripsLeft')}</Text></View>
          </View>
        </View>}
        <Text style={[S.lbSecTitle, { color: th.t }]}>🥇 Top 50</Text>
        {lbLoading ? <ActivityIndicator color={th.p} style={{ marginVertical: 30 }} /> : <ScrollView style={S.lbList}>
          {lbData.map((x, i) => <View key={x.user_id || i} style={[S.lbItem, { backgroundColor: th.c }, x.user_id === u?.id && { borderColor: th.p, borderWidth: 2 }]}>
            <Text style={[S.lbItemR, { color: i < 3 ? ['#FFD700', '#C0C0C0', '#CD7F32'][i] : th.p }]}>{i < 3 ? ['🥇', '🥈', '🥉'][i] : `#${i + 1}`}</Text>
            <View style={[S.lbItemAv, { backgroundColor: i < 3 ? ['#FFD700', '#C0C0C0', '#CD7F32'][i] : th.p }]}><Text style={S.lbItemAvT}>{(x.user_name || 'U')[0].toUpperCase()}</Text></View>
            <View style={S.lbItemInfo}><Text style={[S.lbItemN, { color: th.t }]}>{x.user_name || 'User'}{x.user_id === u?.id && ' (Sen)'}</Text><Text style={[S.lbItemSub, { color: th.t3 }]}>{x.review_count} yorum • {x.trip_count} trip</Text></View>
            <Text style={[S.lbItemP, { color: th.p }]}>{x.points}</Text>
          </View>)}
          {lbData.length === 0 && <View style={S.lbEmptyC}><Text style={{ fontSize: 48, marginBottom: 12 }}>🏆</Text><Text style={[S.lbEmpty, { color: th.t3 }]}>{set.l === 'tr' ? 'Bu ay henüz kimse yok' : 'No one this month yet'}</Text><Text style={[S.lbEmptyD, { color: th.t3 }]}>{set.l === 'tr' ? 'İlk sen ol!' : 'Be the first!'}</Text></View>}
        </ScrollView>}
      </View></View></Modal>

      <Modal visible={revM} animationType="slide"><SafeAreaView style={[S.fm, { backgroundColor: th.bg }]}>
        <View style={[S.sdH, { backgroundColor: th.c }]}>
          <Btn style={S.sdBack} onPress={() => { setRevM(false); setSelSpot(null); setRevTxt(''); setRevStar(5); setShowComments(false); setSpotPhotos([]); setSpotReviews([]); }}><Text style={[S.sdBackT, { color: th.t }]}>←</Text></Btn>
          <Text style={[S.sdTitle, { color: th.t }]} numberOfLines={1}>{selSpot?.n}</Text>
          <Btn style={[S.sdDir, { backgroundColor: th.p }]} onPress={() => selSpot && openD(selSpot)}><Text style={S.sdDirT}>🗺️</Text></Btn>
        </View>
        <ScrollView style={S.sdBody}>
          {loadingSpot ? <ActivityIndicator color={th.p} size="large" style={{ marginVertical: 40 }} /> : <>
            {spotPhotos.length > 0 && <View style={S.sdPhotos}><ScrollView horizontal showsHorizontalScrollIndicator={false}>{spotPhotos.map((p, i) => <Image key={i} source={{ uri: p }} style={S.sdPhoto} />)}</ScrollView></View>}
            <View style={[S.sdInfo, { backgroundColor: th.c }]}>
              <Text style={[S.sdType, { color: th.t3 }]}>{selSpot?.t}</Text>
              {selSpot?.r > 0 && <View style={S.sdRating}><Text style={S.sdRatingS}>⭐</Text><Text style={[S.sdRatingV, { color: th.t }]}>{selSpot?.r?.toFixed(1)}</Text></View>}
            </View>
            <View style={[S.sdRevBox, { backgroundColor: th.c }]}>
              <Text style={[S.sdRevTitle, { color: th.t }]}>✍️ {L('writeReview')}</Text>
              <View style={S.sdStars}>{[1,2,3,4,5].map(s => <Btn key={s} onPress={() => setRevStar(s)}><Text style={[S.sdStar, s <= revStar && S.sdStarA]}>★</Text></Btn>)}</View>
              <TextInput style={[S.sdRevInp, { backgroundColor: th.bg, color: th.t, borderColor: th.b }]} placeholder={L('yourReview')} placeholderTextColor={th.t3} value={revTxt} onChangeText={setRevTxt} multiline numberOfLines={3} />
              <Btn style={[S.sdRevBtn, { backgroundColor: th.p }]} onPress={submitReview}><Text style={S.sdRevBtnT}>{L('save')}</Text></Btn>
            </View>
            <Btn style={[S.sdShowComments, { backgroundColor: th.c }]} onPress={() => setShowComments(!showComments)}>
              <Text style={[S.sdShowCommentsT, { color: th.p }]}>{showComments ? L('hideComments') : L('showComments')} ({spotReviews.length})</Text>
              <Text style={{ color: th.p, fontSize: 18 }}>{showComments ? '▲' : '▼'}</Text>
            </Btn>
            {showComments && <View style={S.sdComments}>
              {spotReviews.length === 0 ? <View style={[S.sdNoComments, { backgroundColor: th.c }]}><Text style={{ fontSize: 40, marginBottom: 12 }}>💬</Text><Text style={[S.sdNoCommentsT, { color: th.t }]}>{L('noComments')}</Text><Text style={[S.sdNoCommentsD, { color: th.t3 }]}>{L('beFirst')}</Text></View> : spotReviews.map((r, i) => <View key={i} style={[S.sdComment, { backgroundColor: th.c }]}>
                <View style={S.sdCommentH}>
                  <View style={[S.sdCommentAv, { backgroundColor: th.p }]}><Text style={S.sdCommentAvT}>{(r.user_name || 'U')[0].toUpperCase()}</Text></View>
                  <View style={S.sdCommentInfo}><Text style={[S.sdCommentName, { color: th.t }]}>{r.user_name || 'User'}</Text><Text style={[S.sdCommentDate, { color: th.t3 }]}>{new Date(r.created_at).toLocaleDateString()}</Text></View>
                  <View style={S.sdCommentRating}>{[1,2,3,4,5].map(s => <Text key={s} style={[S.sdCommentStar, s <= r.rating && S.sdCommentStarA]}>★</Text>)}</View>
                </View>
                <Text style={[S.sdCommentTxt, { color: th.t }]}>{r.comment}</Text>
              </View>)}
            </View>}
          </>}
          <View style={{ height: 40 }} />
        </ScrollView>
      </SafeAreaView></Modal>
    </View>
  );
}

const S = StyleSheet.create({
  c: { flex: 1 }, ctr: { flex: 1, justifyContent: 'center', alignItems: 'center' }, logo: { fontSize: 32, fontWeight: 'bold' },
  ah: { paddingTop: 60, paddingBottom: 40, alignItems: 'center' }, an: { fontSize: 32, fontWeight: 'bold', color: '#fff', letterSpacing: 2 }, at: { fontSize: 14, color: 'rgba(255,255,255,0.9)', marginTop: 8 },
  af: { padding: 24, flex: 1 }, aft: { fontSize: 28, fontWeight: 'bold', marginBottom: 24 }, ic: { marginBottom: 16 }, il: { fontSize: 14, fontWeight: '500', marginBottom: 8 }, inp: { borderWidth: 2, borderRadius: 12, padding: 16, fontSize: 16 },
  rc: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 }, chk: { width: 22, height: 22, borderRadius: 6, borderWidth: 2, borderColor: '#ccc', marginRight: 10, justifyContent: 'center', alignItems: 'center' }, chkm: { color: '#fff', fontSize: 14, fontWeight: 'bold' }, rt: { fontSize: 14 },
  fp: { alignSelf: 'flex-end', marginBottom: 16, marginTop: -8 }, fpt: { fontSize: 14, fontWeight: '500' },
  ab: { marginTop: 8, borderRadius: 12, overflow: 'hidden' }, abg: { padding: 16, alignItems: 'center' }, abt: { color: '#fff', fontSize: 16, fontWeight: '600' }, sw: { marginTop: 24, alignItems: 'center' },
  
  // New Modern Home Styles
  hd2: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 16 },
  hdTitle: { fontSize: 28, fontWeight: '800' }, hdSub: { fontSize: 14, marginTop: 4 },
  hdAv: { width: 48, height: 48, borderRadius: 24 },
  
  srcBar: { flexDirection: 'row', alignItems: 'center', marginHorizontal: 20, paddingHorizontal: 16, paddingVertical: 14, borderRadius: 16, marginBottom: 20 },
  srcIcon: { fontSize: 18, marginRight: 12 }, srcTxt: { fontSize: 16 },
  
  catSec: { marginBottom: 24, paddingLeft: 20 }, catTitle: { fontSize: 18, fontWeight: '700', marginBottom: 16 },
  catList: { paddingRight: 20 }, catItem: { alignItems: 'center', marginRight: 20 },
  catImg: { width: 60, height: 60, borderRadius: 30, justifyContent: 'center', alignItems: 'center', marginBottom: 8 },
  catEmoji: { fontSize: 28 }, catLabel: { fontSize: 12, fontWeight: '500' },
  
  statsRow: { flexDirection: 'row', paddingHorizontal: 20, marginBottom: 20, gap: 10 },
  statCard: { flex: 1, padding: 14, borderRadius: 16, alignItems: 'center', elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 4 },
  statIcon: { fontSize: 24, marginBottom: 6 },
  statVal: { fontSize: 20, fontWeight: '700', marginBottom: 2 },
  statLbl: { fontSize: 11 },
  
  aiBtn: { marginHorizontal: 20, marginBottom: 24, borderRadius: 20, overflow: 'hidden', elevation: 8, shadowColor: '#E07A5F', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8 },
  aiBtnGrad: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 20 },
  aiBtnLeft: { flexDirection: 'row', alignItems: 'center' }, aiBtnIcon: { fontSize: 36, marginRight: 14 },
  aiBtnTitle: { color: '#fff', fontSize: 18, fontWeight: '700' }, aiBtnDesc: { color: 'rgba(255,255,255,0.8)', fontSize: 12, marginTop: 2 },
  aiBtnArrow: { width: 44, height: 44, borderRadius: 22, backgroundColor: 'rgba(255,255,255,0.2)', justifyContent: 'center', alignItems: 'center' }, aiBtnArrowT: { color: '#fff', fontSize: 22, fontWeight: 'bold' },
  
  popSec: { marginBottom: 24 }, popHead: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, marginBottom: 16 },
  popTitle: { fontSize: 18, fontWeight: '700' }, popAll: { fontSize: 14, fontWeight: '600' },
  popList: { paddingLeft: 20, paddingRight: 8 },
  popCard: { width: 180, marginRight: 16, borderRadius: 20, overflow: 'hidden', elevation: 4, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 8 },
  popImg: { width: '100%', height: 140 },
  popOv: { position: 'absolute', top: 12, right: 12 }, popRating: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 10 }, popRatingT: { fontSize: 12, fontWeight: '600' },
  popInfo: { padding: 14 }, popName: { fontSize: 16, fontWeight: '700', marginBottom: 6 },
  popLoc: { flexDirection: 'row', alignItems: 'center' }, popPin: { fontSize: 12, marginRight: 4 }, popCountry: { fontSize: 12 },
  
  tripsSec: { paddingHorizontal: 20, marginBottom: 24 }, tripsTitle: { fontSize: 18, fontWeight: '700', marginBottom: 16 },
  emptyTrips: { padding: 40, borderRadius: 20, alignItems: 'center' }, emptyIcon: { fontSize: 48, marginBottom: 12 }, emptyTitle: { fontSize: 16, fontWeight: '600', marginBottom: 6 }, emptyDesc: { fontSize: 14 },
  tripCard: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 14, borderRadius: 16, marginBottom: 12, elevation: 3, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4 },
  tripLeft: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  tripFlag: { width: 52, height: 52, borderRadius: 16, justifyContent: 'center', alignItems: 'center', marginRight: 14 }, tripFlagT: { fontSize: 28 },
  tripInfo: { flex: 1 }, tripName: { fontSize: 16, fontWeight: '600', marginBottom: 4 }, tripMeta: { fontSize: 13 },
  tripRight: { flexDirection: 'row', alignItems: 'center' }, tripDel: { padding: 8, marginRight: 4 },
  
  tabBar: { position: 'absolute', bottom: 24, left: 40, right: 40, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around', paddingVertical: 14, borderRadius: 35, elevation: 15, shadowColor: '#000', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.35, shadowRadius: 12 },
  tabItem: { width: 50, height: 50, borderRadius: 25, backgroundColor: 'rgba(255,255,255,0.1)', justifyContent: 'center', alignItems: 'center' }, tabIcon: { fontSize: 24 },
  tabItemCenter: { marginTop: -35 }, tabAdd: { width: 64, height: 64, borderRadius: 32, justifyContent: 'center', alignItems: 'center', elevation: 8, shadowColor: '#E07A5F', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.4, shadowRadius: 8 }, tabAddIcon: { color: '#fff', fontSize: 32, fontWeight: '300', lineHeight: 36 }, tabAddGlass: { width: 64, height: 64, borderRadius: 32, justifyContent: 'center', alignItems: 'center', elevation: 8, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8 },
  
  modalHead: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 16 },
  modalBack: { width: 44, height: 44, borderRadius: 22, backgroundColor: 'rgba(0,0,0,0.08)', justifyContent: 'center', alignItems: 'center' }, modalBackT: { fontSize: 24 },
  modalTitle: { fontSize: 18, fontWeight: '600' },
  
  // Old styles kept for compatibility
  hd: { paddingTop: 10, paddingBottom: 20, paddingHorizontal: 20 }, hdt: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }, hdr: { flexDirection: 'row', alignItems: 'center' },
  prb: { backgroundColor: 'rgba(255,255,255,0.2)', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12, marginRight: 10 }, prbt: { fontSize: 16 },
  gr: { fontSize: 14, color: 'rgba(255,255,255,0.8)' }, un: { fontSize: 22, fontWeight: 'bold', color: '#fff' },
  pav: { width: 44, height: 44, borderRadius: 22, backgroundColor: 'rgba(255,255,255,0.3)', justifyContent: 'center', alignItems: 'center' }, pavt: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  ptc: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 20, paddingHorizontal: 14, paddingVertical: 8, alignSelf: 'flex-start' }, ptv: { color: '#fff', fontSize: 16, fontWeight: 'bold', marginRight: 4 }, ptl: { color: 'rgba(255,255,255,0.8)', fontSize: 12 },
  cnt: { flex: 1, padding: 20 },
  big: { marginBottom: 24, borderRadius: 20, overflow: 'hidden', elevation: 8, shadowColor: '#E07A5F', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8 }, bigg: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 20 }, bigc: { flexDirection: 'row', alignItems: 'center' }, bigi: { fontSize: 40, marginRight: 16 }, bigt: { color: '#fff', fontSize: 20, fontWeight: 'bold' }, bigs: { color: 'rgba(255,255,255,0.8)', fontSize: 13, marginTop: 2 }, biga: { width: 44, height: 44, borderRadius: 22, backgroundColor: 'rgba(255,255,255,0.2)', justifyContent: 'center', alignItems: 'center' }, bigat: { color: '#fff', fontSize: 24, fontWeight: 'bold' },
  sec: { marginBottom: 24 }, sect: { fontSize: 18, fontWeight: '700', marginBottom: 12 },
  dc: { width: 160, borderRadius: 16, marginRight: 12, overflow: 'hidden', elevation: 3 }, dimg: { width: '100%', height: 100 }, dov: { position: 'absolute', top: 8, left: 8, backgroundColor: 'rgba(255,255,255,0.9)', borderRadius: 8, padding: 4 }, df: { fontSize: 16 }, dinf: { padding: 12 }, dci: { fontSize: 16, fontWeight: '600' }, dco: { fontSize: 12, marginTop: 2 }, ddy: { fontSize: 12, fontWeight: '600', marginTop: 4 },
  emp: { padding: 40, borderRadius: 20, borderWidth: 2, borderStyle: 'dashed', alignItems: 'center' }, empi: { fontSize: 48, marginBottom: 12 }, empt: { fontSize: 16, fontWeight: '600', marginBottom: 8 }, empd: { fontSize: 14 },
  tc: { flexDirection: 'row', alignItems: 'center', padding: 14, borderRadius: 14, marginBottom: 10, elevation: 3 }, tic: { width: 56, height: 56, borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginRight: 14, overflow: 'hidden' }, tf: { fontSize: 32 }, tinf: { flex: 1 }, tt: { fontSize: 16, fontWeight: '600', marginBottom: 4 }, tm: { fontSize: 13 }, tdl: { padding: 8 }, tdlt: { fontSize: 18 },
  tb: { flexDirection: 'row', borderTopWidth: 1, paddingVertical: 8, paddingBottom: Platform.OS === 'ios' ? 24 : 8 }, ti: { flex: 1, alignItems: 'center', paddingVertical: 8 }, tl: { fontSize: 11, marginTop: 4, fontWeight: '500' },
  sh: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingTop: 10, paddingBottom: 16, paddingHorizontal: 16 }, bk: { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.2)', justifyContent: 'center', alignItems: 'center' }, bkt: { color: '#fff', fontSize: 20, fontWeight: 'bold' }, htc: { flex: 1, alignItems: 'center' }, st: { color: '#fff', fontSize: 18, fontWeight: '600' }, sst: { color: 'rgba(255,255,255,0.8)', fontSize: 12, marginTop: 2 }, db: { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.2)', justifyContent: 'center', alignItems: 'center' }, dbt: { fontSize: 18 },
  mc: { height: 200, marginHorizontal: 16, marginTop: 8, marginBottom: 0, borderRadius: 16, overflow: 'hidden' }, me: { height: 350 }, map: { flex: 1 }, mapHint: { position: 'absolute', bottom: 8, right: 8, backgroundColor: 'rgba(0,0,0,0.5)', borderRadius: 12, paddingHorizontal: 8, paddingVertical: 4 }, mapHintT: { fontSize: 14 }, mk: { width: 28, height: 28, borderRadius: 14, justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: '#fff' }, mkt: { color: '#fff', fontSize: 12, fontWeight: 'bold' },
  dts: { paddingHorizontal: 16, paddingVertical: 8 }, dtsC: { alignItems: 'center' }, dt: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, borderWidth: 1.5, marginRight: 8 }, dtt: { fontSize: 12, fontWeight: '600' }, optBtn: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, marginLeft: 4 }, optBtnT: { fontSize: 16 },
  sl: { paddingHorizontal: 16 }, di: { flexDirection: 'row', alignItems: 'center', marginVertical: 6 }, dl: { flex: 1, height: 1 }, dib: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10, borderWidth: 1 }, dit: { fontSize: 11 },
  sc: { flexDirection: 'row', alignItems: 'center', padding: 12, borderRadius: 14, marginBottom: 10 }, sn: { width: 28, height: 28, borderRadius: 14, justifyContent: 'center', alignItems: 'center', marginRight: 10 }, snt: { color: '#fff', fontSize: 12, fontWeight: 'bold' }, si: { width: 70, height: 70, borderRadius: 10, marginRight: 12 }, sinf: { flex: 1 }, snm: { fontSize: 14, fontWeight: '600', marginBottom: 2 }, sty: { fontSize: 11, marginBottom: 2 }, sr: { fontSize: 11 }, drb: { paddingHorizontal: 12, paddingVertical: 10, borderRadius: 10 }, drbt: { fontSize: 18 },
  lc: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }, lcc: { padding: 30, borderRadius: 20, alignItems: 'center', width: '100%' }, li: { fontSize: 48, marginBottom: 16 }, lt: { fontSize: 20, fontWeight: 'bold', marginBottom: 8 }, ld: { fontSize: 14, textAlign: 'center', marginBottom: 20 }, ub: { borderRadius: 12, overflow: 'hidden' }, ubg: { paddingHorizontal: 24, paddingVertical: 14 }, ubt: { color: '#fff', fontSize: 16, fontWeight: '600' },
  mo: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' }, fm: { flex: 1 },
  mh: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingTop: 10, paddingBottom: 16, paddingHorizontal: 16 }, mcb: { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.2)', justifyContent: 'center', alignItems: 'center' }, mcbt: { color: '#fff', fontSize: 18, fontWeight: 'bold' }, mt: { color: '#fff', fontSize: 18, fontWeight: '600' }, mct: { flex: 1, padding: 20 }, mst: { fontSize: 16, marginBottom: 16 },
  csb: { flexDirection: 'row', alignItems: 'center', borderRadius: 16, borderWidth: 1, paddingHorizontal: 16, marginBottom: 16 }, csi: { fontSize: 18, marginRight: 10 }, csin: { flex: 1, paddingVertical: 16, fontSize: 16 },
  cri: { flexDirection: 'row', alignItems: 'center', padding: 14, borderRadius: 12, marginBottom: 8 }, cric: { fontSize: 20, marginRight: 12 }, crif: { flex: 1 }, crin: { fontSize: 16, fontWeight: '600' }, crifl: { fontSize: 12, marginTop: 2 }, qp: { marginTop: 16 }, qpt: { fontSize: 14, fontWeight: '600', marginBottom: 12 },
  bs: { borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24, paddingTop: 12 }, bsh: { width: 40, height: 4, backgroundColor: '#ddd', borderRadius: 2, alignSelf: 'center', marginBottom: 16 }, bsClose: { position: 'absolute', top: 12, right: 16, zIndex: 10, width: 32, height: 32, borderRadius: 16, backgroundColor: 'rgba(0,0,0,0.1)', justifyContent: 'center', alignItems: 'center' }, bsCloseT: { fontSize: 18 }, bst: { fontSize: 22, fontWeight: 'bold', textAlign: 'center', marginBottom: 8 }, bsst: { fontSize: 14, textAlign: 'center', marginBottom: 20 },
  dpc: { marginBottom: 20 }, dps: { paddingVertical: 10 }, dpi: { width: 70, height: 80, borderRadius: 16, borderWidth: 2, justifyContent: 'center', alignItems: 'center', marginRight: 12 }, dpn: { fontSize: 28, fontWeight: 'bold' }, dpl: { fontSize: 12, marginTop: 4 }, pinf: { padding: 12, borderRadius: 12, marginBottom: 16 }, pinft: { fontSize: 13, textAlign: 'center', fontWeight: '500' },
  ctb: { borderRadius: 14, overflow: 'hidden', marginTop: 8 }, ctbg: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: 16 }, ctbt: { color: '#fff', fontSize: 16, fontWeight: '600', marginRight: 8 }, ctba: { color: '#fff', fontSize: 18 },
  // Multi-city styles
  mcList: { marginBottom: 16 }, mcListT: { fontSize: 16, fontWeight: '600', marginBottom: 12 },
  mcItem: { flexDirection: 'row', alignItems: 'center', padding: 12, borderRadius: 12, marginBottom: 8 },
  mcItemF: { fontSize: 24, marginRight: 12 }, mcItemInfo: { flex: 1 }, mcItemN: { fontSize: 15, fontWeight: '600' }, mcItemD: { fontSize: 12, marginTop: 2 },
  mcTotal: { borderTopWidth: 1, paddingTop: 12, marginTop: 4 }, mcTotalT: { fontSize: 14, fontWeight: '500' },
  addCityBtn: { borderWidth: 2, borderStyle: 'dashed', borderRadius: 14, padding: 14, alignItems: 'center', marginBottom: 12 }, addCityBtnT: { fontSize: 15, fontWeight: '600' },
  mcCityBadge: { flexDirection: 'row', alignItems: 'center', alignSelf: 'center', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, marginTop: 8 }, mcCityBadgeF: { fontSize: 18, marginRight: 8 }, mcCityBadgeT: { fontSize: 14, fontWeight: '600' },
  cfs: { borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24, paddingTop: 12 }, pcc: { alignItems: 'center' }, pci: { fontSize: 48, marginBottom: 16 }, pct: { fontSize: 22, fontWeight: 'bold', textAlign: 'center', marginBottom: 24 }, pcbs: { width: '100%' }, pcb: { borderRadius: 14, overflow: 'hidden', marginBottom: 12 }, pcbg: { padding: 16, alignItems: 'center' }, pcbt: { color: '#fff', fontSize: 16, fontWeight: '600' }, pcbo: { borderRadius: 14, borderWidth: 2, padding: 16, alignItems: 'center' }, pcbot: { fontSize: 16, fontWeight: '600' },
  prc: { flex: 1, padding: 20 }, prst: { fontSize: 16, marginBottom: 20 }, prg: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 }, pch: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 14, paddingVertical: 10, borderRadius: 20, borderWidth: 1.5 }, pchi: { fontSize: 16, marginRight: 6 }, pchl: { fontSize: 13, fontWeight: '500' }, prf: { padding: 20, borderTopWidth: 1 }, gnb: { borderRadius: 14, overflow: 'hidden' }, gnbg: { padding: 16, alignItems: 'center' }, gnbt: { color: '#fff', fontSize: 16, fontWeight: '600' },
  mnc: { flex: 1, padding: 20 }, mnst: { fontSize: 16, fontWeight: '600', marginBottom: 12, marginTop: 8 }, mnds: { marginBottom: 16 }, mndb: { paddingHorizontal: 20, paddingVertical: 12, borderRadius: 12, borderWidth: 2, marginRight: 10 }, mndbt: { fontSize: 14, fontWeight: '600' },
  cats: { marginBottom: 16 }, cach: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 14, paddingVertical: 10, borderRadius: 12, borderWidth: 1, marginRight: 10 }, cachi: { fontSize: 18, marginRight: 6 }, cachl: { fontSize: 13, fontWeight: '500' },
  capl: { marginTop: 8 }, capi: { flexDirection: 'row', alignItems: 'center', padding: 12, borderRadius: 12, marginBottom: 10 }, capimg: { width: 60, height: 60, borderRadius: 10, marginRight: 12 }, capinf: { flex: 1 }, capn: { fontSize: 14, fontWeight: '600' }, capa: { fontSize: 11, marginTop: 2 }, capr: { fontSize: 11, marginTop: 2 }, adpb: { width: 36, height: 36, borderRadius: 18, justifyContent: 'center', alignItems: 'center' }, adpbt: { color: '#fff', fontSize: 20, fontWeight: 'bold' },
  ads: { marginTop: 20 }, addg: { marginBottom: 16 }, addl: { fontSize: 14, fontWeight: '600', marginBottom: 8 }, adsi: { flexDirection: 'row', alignItems: 'center', padding: 10, borderRadius: 10, marginBottom: 6 }, adsb: { width: 24, height: 24, borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginRight: 10 }, adsbt: { color: '#fff', fontSize: 11, fontWeight: 'bold' }, adsn: { flex: 1, fontSize: 13 },
  mnf: { padding: 20, borderTopWidth: 1 }, svb: { borderRadius: 14, overflow: 'hidden' }, svbg: { padding: 16, alignItems: 'center' }, svbt: { color: '#fff', fontSize: 16, fontWeight: '600' },
  cm: { margin: 20, borderRadius: 20, padding: 24, alignItems: 'center' }, ci: { fontSize: 48, marginBottom: 16 }, ct: { fontSize: 20, fontWeight: 'bold', marginBottom: 8 }, cd: { fontSize: 14, textAlign: 'center', marginBottom: 24 }, cbs: { flexDirection: 'row', gap: 12 }, cb: { flex: 1, padding: 14, borderRadius: 12, alignItems: 'center' }, cbt: { fontSize: 14, fontWeight: '600' },
  ps: { borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24, paddingTop: 12, alignItems: 'center' }, px: { position: 'absolute', top: 16, right: 16 }, pi: { fontSize: 64, marginBottom: 16, marginTop: 20 }, pt: { fontSize: 28, fontWeight: 'bold', marginBottom: 8 }, pbl: { width: '100%', marginBottom: 24 }, pbi: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 }, pbc: { color: '#4CAF50', fontSize: 18, marginRight: 12, fontWeight: 'bold' }, pbt: { fontSize: 15 }, pb: { borderRadius: 14, overflow: 'hidden', width: '100%' }, pbg: { padding: 16, alignItems: 'center' }, pbx: { color: '#fff', fontSize: 16, fontWeight: '600' },
  pfm: { borderTopLeftRadius: 24, borderTopRightRadius: 24, maxHeight: '90%', marginTop: 'auto' }, pfh: { padding: 20, paddingTop: 16, borderTopLeftRadius: 24, borderTopRightRadius: 24 }, clb: { alignSelf: 'flex-end', width: 32, height: 32, borderRadius: 16, backgroundColor: 'rgba(255,255,255,0.2)', justifyContent: 'center', alignItems: 'center' }, clbt: { color: '#fff', fontSize: 16 }, pfinf: { alignItems: 'center', marginTop: 8 }, pfavl: { width: 80, height: 80, borderRadius: 40, backgroundColor: 'rgba(255,255,255,0.3)', justifyContent: 'center', alignItems: 'center', marginBottom: 12 }, pfavlt: { color: '#fff', fontSize: 32, fontWeight: 'bold' }, pfnm: { color: '#fff', fontSize: 20, fontWeight: 'bold' }, pfem: { color: 'rgba(255,255,255,0.8)', fontSize: 14, marginTop: 4 }, ptsb: { backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: 16, padding: 16, marginTop: 16, flexDirection: 'row', justifyContent: 'center', alignItems: 'baseline' }, ptsbv: { color: '#fff', fontSize: 32, fontWeight: 'bold', marginRight: 8 }, ptsbl: { color: 'rgba(255,255,255,0.8)', fontSize: 14 }, pfcnt: { padding: 20 },
  prpb: { flexDirection: 'row', alignItems: 'center', padding: 16, borderRadius: 16, marginBottom: 20 }, prpbi: { fontSize: 24, marginRight: 12 }, prpbt: { flex: 1, fontSize: 16, fontWeight: '600' }, prpbbdg: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12 }, prpbbdgt: { color: '#fff', fontSize: 12, fontWeight: '600' },
  stsec: { borderRadius: 16, padding: 16, marginBottom: 20 }, stsect: { fontSize: 16, fontWeight: '600', marginBottom: 16 }, sti: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: 'rgba(0,0,0,0.05)' }, stl: { fontSize: 15 }, stv: { fontSize: 14, fontWeight: '500' },
  lgb: { padding: 16, alignItems: 'center' }, lgbt: { color: '#ef5350', fontSize: 16, fontWeight: '600' },
  svhb: { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.2)', justifyContent: 'center', alignItems: 'center' }, svhbt: { fontSize: 18 },
  spActs: { flexDirection: 'row', alignItems: 'center', gap: 6 }, spAct: { width: 32, height: 32, borderRadius: 8, backgroundColor: '#f5f5f5', justifyContent: 'center', alignItems: 'center' }, spActT: { fontSize: 16, fontWeight: '600', color: '#666' },
  rkBdg: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.2)', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 16, marginTop: 8 }, rkBdgI: { fontSize: 16, marginRight: 6 }, rkBdgT: { color: '#fff', fontSize: 14, fontWeight: '600' },
  lbBtn: { flexDirection: 'row', alignItems: 'center', padding: 16, borderRadius: 16, marginBottom: 16 }, lbBtnI: { fontSize: 24, marginRight: 12 }, lbBtnT: { flex: 1, fontSize: 16, fontWeight: '600' },
  supDesc: { fontSize: 14, marginBottom: 12 }, supBtn: { flexDirection: 'row', alignItems: 'center', padding: 14, borderRadius: 12, borderWidth: 1, marginBottom: 8 }, supBtnI: { fontSize: 20, marginRight: 12 }, supBtnT: { fontSize: 15 },
  addedBar: { padding: 10, borderRadius: 10, marginBottom: 12 }, addedBarT: { fontSize: 13, fontWeight: '500' },
  addedBdg: { width: 36, height: 36, borderRadius: 18, justifyContent: 'center', alignItems: 'center' }, addedBdgT: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  genMO: { flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'center', alignItems: 'center' }, genMC: { width: '80%', padding: 30, borderRadius: 20, alignItems: 'center' }, genMT: { fontSize: 20, fontWeight: '600', marginTop: 20, marginBottom: 8 }, genMS: { fontSize: 14, marginBottom: 20 }, genMB: { width: '100%', height: 4, backgroundColor: '#e0e0e0', borderRadius: 2, overflow: 'hidden' }, genMBP: { width: '60%', height: '100%' },
  lbMC: { borderTopLeftRadius: 24, borderTopRightRadius: 24, maxHeight: '90%', paddingTop: 16 }, lbMH: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, marginBottom: 16 }, lbMHT: { fontSize: 22, fontWeight: 'bold' },
  lbMyStats: { marginHorizontal: 20, padding: 16, borderRadius: 16, marginBottom: 16 }, lbMyTitle: { fontSize: 16, fontWeight: '600', marginBottom: 12 }, lbMyRow: { flexDirection: 'row', justifyContent: 'space-around' }, lbMyStat: { alignItems: 'center' }, lbMyVal: { fontSize: 24, fontWeight: 'bold' }, lbMyLbl: { fontSize: 12, marginTop: 4 },
  lbSecTitle: { fontSize: 18, fontWeight: '600', paddingHorizontal: 20, marginBottom: 12 },
  lbRanks: { paddingHorizontal: 16, marginBottom: 16 }, lbRankBtn: { paddingHorizontal: 16, paddingVertical: 10, borderRadius: 12, borderWidth: 1, marginRight: 10, alignItems: 'center' }, lbRankI: { fontSize: 20, marginBottom: 4 }, lbRankT: { fontSize: 12, fontWeight: '500' },
  lbList: { paddingHorizontal: 20, maxHeight: 400 }, lbItem: { flexDirection: 'row', alignItems: 'center', padding: 14, borderRadius: 12, marginBottom: 8 }, lbItemR: { fontSize: 16, fontWeight: 'bold', width: 40 }, lbItemAv: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#FF9800', justifyContent: 'center', alignItems: 'center', marginRight: 12 }, lbItemAvT: { color: '#fff', fontSize: 16, fontWeight: 'bold' }, lbItemInfo: { flex: 1 }, lbItemN: { fontSize: 15, fontWeight: '500' }, lbItemSub: { fontSize: 12, marginTop: 2 }, lbItemP: { fontSize: 18, fontWeight: 'bold' }, 
  lbEmptyC: { alignItems: 'center', paddingVertical: 40 }, lbEmpty: { fontSize: 16, textAlign: 'center' }, lbEmptyD: { fontSize: 14, marginTop: 4 },
  revMC: { borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24, paddingTop: 12 }, revMT: { fontSize: 18, fontWeight: '600', textAlign: 'center', marginBottom: 8 }, revMS: { fontSize: 14, textAlign: 'center', marginBottom: 16 },
  revStars: { flexDirection: 'row', justifyContent: 'center', marginBottom: 20 }, revStar: { fontSize: 36, color: '#ddd', marginHorizontal: 4 }, revStarA: { color: '#FFD700' },
  revInp: { borderWidth: 1, borderRadius: 12, padding: 14, fontSize: 16, minHeight: 100, textAlignVertical: 'top', marginBottom: 20 },
  revBtns: { flexDirection: 'row', gap: 12 }, revBtn: { flex: 1, padding: 14, borderRadius: 12, alignItems: 'center' }, revBtnT: { fontSize: 16, fontWeight: '600' },
  sdH: { flexDirection: 'row', alignItems: 'center', padding: 16, borderBottomWidth: 1, borderBottomColor: 'rgba(0,0,0,0.1)' },
  sdBack: { width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center' }, sdBackT: { fontSize: 24, fontWeight: 'bold' },
  sdTitle: { flex: 1, fontSize: 18, fontWeight: '600', marginHorizontal: 12 },
  sdDir: { paddingHorizontal: 16, paddingVertical: 10, borderRadius: 12 }, sdDirT: { fontSize: 18 },
  sdBody: { flex: 1 },
  sdPhotos: { marginBottom: 16 }, sdPhoto: { width: 280, height: 200, borderRadius: 12, marginRight: 12, marginLeft: 16, marginTop: 16 },
  sdInfo: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16, marginHorizontal: 16, borderRadius: 12, marginBottom: 12 },
  sdType: { fontSize: 14, textTransform: 'capitalize' }, sdRating: { flexDirection: 'row', alignItems: 'center' }, sdRatingS: { fontSize: 18, marginRight: 4 }, sdRatingV: { fontSize: 16, fontWeight: '600' },
  sdAbout: { padding: 16, marginHorizontal: 16, borderRadius: 12, marginBottom: 16 }, sdAboutTitle: { fontSize: 16, fontWeight: '600', marginBottom: 10 }, sdAboutTxt: { fontSize: 14, lineHeight: 22 },
  sdRevBox: { padding: 16, marginHorizontal: 16, borderRadius: 12, marginBottom: 16 },
  sdRevTitle: { fontSize: 16, fontWeight: '600', marginBottom: 12 },
  sdStars: { flexDirection: 'row', justifyContent: 'center', marginBottom: 12 }, sdStar: { fontSize: 32, color: '#ddd', marginHorizontal: 4 }, sdStarA: { color: '#FFD700' },
  sdRevInp: { borderWidth: 1, borderRadius: 12, padding: 12, fontSize: 15, minHeight: 80, textAlignVertical: 'top', marginBottom: 12 },
  sdRevBtn: { padding: 14, borderRadius: 12, alignItems: 'center' }, sdRevBtnT: { color: '#fff', fontSize: 16, fontWeight: '600' },
  sdShowComments: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16, marginHorizontal: 16, borderRadius: 12, marginBottom: 16 },
  sdShowCommentsT: { fontSize: 15, fontWeight: '600' },
  sdComments: { paddingHorizontal: 16 },
  sdNoComments: { padding: 40, borderRadius: 12, alignItems: 'center', marginBottom: 16 }, sdNoCommentsT: { fontSize: 16, fontWeight: '600', marginBottom: 4 }, sdNoCommentsD: { fontSize: 14 },
  sdComment: { padding: 16, borderRadius: 12, marginBottom: 12 },
  sdCommentH: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  sdCommentAv: { width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center', marginRight: 12 }, sdCommentAvT: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  sdCommentInfo: { flex: 1 }, sdCommentName: { fontSize: 15, fontWeight: '600' }, sdCommentDate: { fontSize: 12, marginTop: 2 },
  sdCommentRating: { flexDirection: 'row' }, sdCommentStar: { fontSize: 14, color: '#ddd' }, sdCommentStarA: { color: '#FFD700' },
  sdCommentTxt: { fontSize: 14, lineHeight: 20 },
  // Budget Travel styles
  budgetBtn: { marginHorizontal: 20, marginBottom: 24 },
  budgetBtnInner: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16, borderRadius: 16, elevation: 3, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4 },
  budgetBtnLeft: { flexDirection: 'row', alignItems: 'center' },
  budgetBtnIcon: { fontSize: 32, marginRight: 14 },
  budgetBtnTitle: { fontSize: 16, fontWeight: '700' },
  budgetBtnDesc: { fontSize: 12, marginTop: 2 },
  budgetBtnBadge: { width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center' },
  budgetBtnBadgeT: { color: '#fff', fontSize: 20, fontWeight: 'bold' },
  budgetLabel: { fontSize: 16, fontWeight: '600', marginBottom: 12 },
  budgetCitySelected: { flexDirection: 'row', alignItems: 'center', padding: 16, borderRadius: 12 },
  budgetCityFlag: { fontSize: 28, marginRight: 12 },
  budgetCityName: { flex: 1, fontSize: 16, fontWeight: '600' },
  budgetCityList: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  budgetCityItem: { padding: 12, borderRadius: 12, alignItems: 'center', width: '30%' },
  budgetCityItemF: { fontSize: 28, marginBottom: 4 },
  budgetCityItemN: { fontSize: 12, fontWeight: '500' },
  budgetSliderBox: { padding: 20, borderRadius: 16 },
  budgetAmount: { fontSize: 36, fontWeight: 'bold', textAlign: 'center', marginBottom: 16 },
  budgetSliderRow: { flexDirection: 'row', alignItems: 'center' },
  budgetMinMax: { fontSize: 12, width: 40 },
  budgetSlider: { flex: 1, height: 8, marginHorizontal: 8, borderRadius: 4, overflow: 'hidden' },
  budgetSliderTrack: { position: 'absolute', width: '100%', height: '100%', borderRadius: 4 },
  budgetSliderFill: { height: '100%', borderRadius: 4 },
  budgetBtns: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 16 },
  budgetQuick: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20 },
  budgetQuickT: { fontSize: 14, fontWeight: '600' },
  budgetDaysRow: { flexDirection: 'row', justifyContent: 'space-between' },
  budgetDayBtn: { flex: 1, padding: 16, borderRadius: 12, alignItems: 'center', marginHorizontal: 4 },
  budgetDayNum: { fontSize: 24, fontWeight: 'bold' },
  budgetDayLbl: { fontSize: 11, marginTop: 2 },
  budgetInfo: { flexDirection: 'row', alignItems: 'center', padding: 16, borderRadius: 12, marginTop: 24 },
  budgetInfoIcon: { fontSize: 24, marginRight: 12 },
  budgetInfoText: { flex: 1, fontSize: 13, lineHeight: 20 },
  budgetFooter: { padding: 20, borderTopWidth: 1 },
  budgetGenBtn: { borderRadius: 14, overflow: 'hidden' },
  budgetGenBtnGrad: { padding: 16, alignItems: 'center' },
  budgetGenBtnT: { color: '#fff', fontSize: 16, fontWeight: '600' },
  budgetPopLabel: { fontSize: 13, fontWeight: '500', marginBottom: 10 },
  delAllBtn: { flexDirection: 'row', alignItems: 'center', padding: 14, borderRadius: 12 },
  delAllBtnI: { fontSize: 20, marginRight: 12 },
  delAllBtnT: { fontSize: 15, color: '#ef5350', fontWeight: '500' },
  // All Destinations styles
  allDestGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  allDestCard: { width: (width - 48) / 2, borderRadius: 16, marginBottom: 16, overflow: 'hidden', elevation: 3, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4 },
  allDestImg: { width: '100%', height: 100 },
  allDestInfo: { padding: 12 },
  allDestFlag: { fontSize: 24, marginBottom: 4 },
  allDestName: { fontSize: 16, fontWeight: '600', marginBottom: 2 },
  allDestCountry: { fontSize: 12, marginBottom: 8 },
  allDestRating: { alignSelf: 'flex-start', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  allDestRatingT: { fontSize: 12, fontWeight: '600' },
  // No Budget button
  noBudgetBtn: { padding: 14, borderRadius: 12, borderWidth: 1.5, marginBottom: 12 },
  noBudgetBtnT: { fontSize: 15, fontWeight: '500', textAlign: 'center' },
  budgetSliderWrap: { flex: 1, height: 8, borderRadius: 4, position: 'relative', marginHorizontal: 8 },
  budgetSliderThumb: { position: 'absolute', width: 20, height: 20, borderRadius: 10, top: -6, marginLeft: -10 },
  // Spot cost
  spotMetaRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  spotCost: { fontSize: 12, fontWeight: '600' },
  // Budget summary
  budgetSummary: { flexDirection: 'row', marginHorizontal: 16, marginBottom: 12, padding: 12, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  budgetSummaryItem: { alignItems: 'center', flex: 1 },
  budgetSummaryLabel: { fontSize: 11, marginBottom: 2 },
  budgetSummaryValue: { fontSize: 18, fontWeight: '700' },
  budgetSummaryDivider: { width: 1, height: 30, backgroundColor: 'rgba(128,128,128,0.3)', marginHorizontal: 8 },
  // Day Picker (Basit stil)
  dayPickerContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 20 },
  dayPickerTitle: { fontSize: 32, fontWeight: '700', marginBottom: 30 },
  dayPickerScrollWrap: { maxHeight: 350, width: '100%' },
  dayPickerScrollContent: { alignItems: 'center', paddingVertical: 20 },
  dayPickerItem: { width: '80%', paddingVertical: 12, marginVertical: 4, alignItems: 'center', borderRadius: 12 },
  dayPickerItemActive: { backgroundColor: 'rgba(128,128,128,0.15)' },
  dayPickerNum: { fontSize: 28, fontWeight: '400' },
  dayPickerLabel: { fontSize: 18, marginTop: 20 },
  // Manual Button
  manualBtn: { marginHorizontal: 16, marginTop: 12 },
  manualBtnInner: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16, borderRadius: 16, borderWidth: 1, borderColor: 'rgba(128,128,128,0.2)' },
  manualBtnLeft: { flexDirection: 'row', alignItems: 'center' },
  manualBtnIcon: { fontSize: 28, marginRight: 12 },
  manualBtnTitle: { fontSize: 16, fontWeight: '600' },
  manualBtnDesc: { fontSize: 12, marginTop: 2 },
  // Pref Summary
  prefSummary: { flexDirection: 'row', alignItems: 'center', padding: 16, borderRadius: 12, marginBottom: 24 },
  prefSummaryF: { fontSize: 32, marginRight: 12 },
  prefSummaryN: { fontSize: 18, fontWeight: '600' },
  prefSummaryD: { fontSize: 13, marginTop: 2 },
  // FAB Menu - iOS Glassmorphism style
  fabFullOverlay: { flex: 1 },
  fabTouchArea: { flex: 1, justifyContent: 'flex-end' },
  fabContentBottom: { paddingHorizontal: 24, paddingBottom: 120 },
  fabOption: { marginBottom: 12, borderRadius: 20, overflow: 'hidden' },
  fabOptionBlur: { borderRadius: 20, overflow: 'hidden' },
  fabOptionContent: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 20 },
  fabOptionTitle: { fontSize: 20, fontWeight: '600', color: '#fff' },
  fabOptionTitleDark: { fontSize: 20, fontWeight: '600', color: '#1a1a2e' },
  fabOptionEmoji: { fontSize: 32 },
  // X button - above blur
  fabXContainer: { position: 'absolute', bottom: 24, left: 0, right: 0, alignItems: 'center' },
  fabXBtn: { width: 64, height: 64, borderRadius: 32, justifyContent: 'center', alignItems: 'center', elevation: 10, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8 },
  fabXIcon: { color: '#fff', fontSize: 28, fontWeight: '300' },
  // Tab bar glass button
  tabAddGlass: { width: 56, height: 56, borderRadius: 28, justifyContent: 'center', alignItems: 'center' },
});