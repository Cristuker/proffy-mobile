import React, { useState } from "react";
import { View, Image, Text, Linking } from "react-native";
import { RectButton } from "react-native-gesture-handler";
import AsyncStorage from "@react-native-community/async-storage";
import api from "../../services/api";

import heartOutline from "../../assets/images/icons/heart-outline.png";
import unfavoriteIcon from "../../assets/images/icons/unfavorite.png";
import whatsAppIcon from "../../assets/images/icons/whatsapp.png";

import styles from "./styles";

interface Teacher {
    avatar: string;
    bio: string;
    cost: number;
    id: number;
    name: string;
    subject: string;
    user_id: number;
    whatsapp: string;
}
interface TeacherItemProps {
    teacher: Teacher;
    favorited: boolean;
}

const TeacherItem: React.FC<TeacherItemProps> = ({ teacher, favorited }) => {
    const [isFavorited, setIsFavorited] = useState(favorited);
    function handleLinkToWhatsApp() {
        api.post("connections", {
            user_id: teacher.id,
        });
        Linking.openURL(
            `whatsapp://send?text=Quero ter aulas com você!&phone=${teacher.whatsapp}`
        );
    }
    async function handleToggleFavorite() {
        const favorites = await AsyncStorage.getItem("favorites");

        let favoritesArray = [];

        if (favorites) {
            favoritesArray = JSON.parse(favorites);
        }

        if (isFavorited) {
            const favoriteIndex = favoritesArray.findIndex(
                (teacherItem: Teacher) => {
                    return teacherItem.id === teacher.id;
                }
            );
            favoritesArray.splice(favoriteIndex, 1);
            setIsFavorited(false);
        } else {
            favoritesArray.push(teacher);

            setIsFavorited(true);
        }
        await AsyncStorage.setItem("favorites", JSON.stringify(favoritesArray));
    }
    return (
        <View style={styles.container}>
            <View style={styles.profile}>
                <Image style={styles.avatar} source={{ uri: teacher.avatar }} />
                <View style={styles.profileInfo}>
                    <Text style={styles.name}>{teacher.name}</Text>
                    <Text style={styles.subject}>{teacher.subject}</Text>
                </View>
            </View>
            <Text style={styles.bio}>{teacher.bio}</Text>
            <View style={styles.footer}>
                <Text style={styles.price}>Preço/hora {"   "}</Text>
                <Text style={styles.priceValue}>R$ {teacher.cost}</Text>
                <View style={styles.buttonContainer}>
                    <RectButton
                        onPress={handleToggleFavorite}
                        style={[
                            styles.favoriteButton,
                            isFavorited ? styles.favorited : {},
                        ]}
                    >
                        {isFavorited ? (
                            <Image source={unfavoriteIcon} />
                        ) : (
                            <Image source={heartOutline} />
                        )}
                    </RectButton>

                    <RectButton
                        onPress={handleLinkToWhatsApp}
                        style={styles.contact}
                    >
                        <Image source={whatsAppIcon} />
                        <Text style={styles.contactText}>
                            Entrar em contato
                        </Text>
                    </RectButton>
                </View>
            </View>
        </View>
    );
};

export default TeacherItem;
