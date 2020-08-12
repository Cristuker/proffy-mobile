import React, { useState, useEffect } from "react";
import { View, ScrollView } from "react-native";

import { PageHeader, TeacherItem } from "../../components";
import AsyncStorage from "@react-native-community/async-storage";
import { useFocusEffect } from "@react-navigation/native";

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
}

const Favorites: React.FC = () => {
    const [favorites, setFavorites] = useState([]);

    function loadFavorites() {
        AsyncStorage.getItem("favorites")
            .then((response) => {
                if (response) {
                    const favoriteTeachers = JSON.parse(response);

                    setFavorites(favoriteTeachers);
                }
            })
            .catch((error) => console.log("Error on favorites", error));
    }

    useFocusEffect(() => {
        loadFavorites();
    });
    return (
        <View style={styles.container}>
            <PageHeader title="Meus proffys favoritos" />
            <ScrollView
                style={styles.teacherList}
                contentContainerStyle={{
                    paddingHorizontal: 16,
                    paddingBottom: 16,
                }}
            >
                {favorites.map((teacher: Teacher, index) => {
                    return <TeacherItem key={index} teacher={teacher} />;
                })}
            </ScrollView>
        </View>
    );
};

export default Favorites;
