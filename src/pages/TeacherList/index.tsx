import React, { useState, useEffect } from "react";
import { View, Text, TextInput } from "react-native";
import {
    ScrollView,
    BorderlessButton,
    RectButton,
} from "react-native-gesture-handler";
import { useFocusEffect } from "@react-navigation/native";
import AsyncStorage from "@react-native-community/async-storage";

import { PageHeader, TeacherItem } from "../../components";
import { Feather } from "@expo/vector-icons";

import styles from "./styles";

import api from "../../services/api";

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

const TeacherList: React.FC = () => {
    const [isFiltersVisible, setIsFiltersVisible] = useState(false);
    const [favorites, setFavorites] = useState<number[]>([]);
    const [teachers, setTeachers] = useState([]);
    const [subject, setSubject] = useState("");
    const [weekDay, setWeekDay] = useState("");
    const [time, setTime] = useState("");

    function loadFavorites() {
        AsyncStorage.getItem("favorites")
            .then((response) => {
                if (response) {
                    const favoriteTeachers = JSON.parse(response);
                    const favoritedTeachersIds = favoriteTeachers.map(
                        (teacher: TeacherItemProps) => {
                            return teacher.id;
                        }
                    );
                    setFavorites(favoritedTeachersIds);
                }
            })
            .catch((error) => console.log("Error on get favorites", error));
    }

    function handleToggleFiltersVisible() {
        setIsFiltersVisible(!isFiltersVisible);
    }

    function handleFiltersSubmit() {
        loadFavorites();
        api.get("classes", {
            params: {
                subject,
                week_day: weekDay,
                time,
            },
        })
            .then((response) => {
                setTeachers(response.data);
                setTimeout(() => {
                    handleToggleFiltersVisible();
                }, 500);
            })
            .catch((error) => {
                console.log(error);
            });
    }
    useFocusEffect(() => {
        loadFavorites();
    });
    return (
        <View style={styles.container}>
            <PageHeader
                title="Proffys disponiveis"
                headerRight={
                    <BorderlessButton onPress={handleToggleFiltersVisible}>
                        <Feather name="filter" size={20} color="#fff" />
                    </BorderlessButton>
                }
            >
                {isFiltersVisible && (
                    <View style={styles.searchForm}>
                        <Text style={styles.label}>Matéria</Text>
                        <TextInput
                            placeholderTextColor="#c1bccc"
                            style={styles.input}
                            placeholder="Qual é a matéria"
                            value={subject}
                            onChangeText={(text) => setSubject(text)}
                        />
                        <View style={styles.inputGroup}>
                            <View style={styles.inputBlock}>
                                <Text style={styles.label}>Dia da semana</Text>
                                <TextInput
                                    placeholderTextColor="#c1bccc"
                                    style={styles.input}
                                    placeholder="Qual o dia?"
                                    value={weekDay}
                                    onChangeText={(weekDay) =>
                                        setWeekDay(weekDay)
                                    }
                                />
                            </View>
                            <View style={styles.inputBlock}>
                                <Text style={styles.label}>Horário</Text>
                                <TextInput
                                    placeholderTextColor="#c1bccc"
                                    style={styles.input}
                                    placeholder="Qual horário?"
                                    value={time}
                                    onChangeText={(time) => setTime(time)}
                                />
                            </View>
                        </View>
                        <RectButton
                            onPress={handleFiltersSubmit}
                            style={styles.submitButton}
                        >
                            <Text style={styles.submitButtonText}>Filtrar</Text>
                        </RectButton>
                    </View>
                )}
            </PageHeader>
            <ScrollView
                style={styles.teacherList}
                contentContainerStyle={{
                    paddingHorizontal: 16,
                    paddingBottom: 16,
                }}
            >
                {teachers.length > 0 ? (
                    teachers.map((teacher: TeacherItemProps, index) => {
                        return (
                            <TeacherItem
                                key={index}
                                teacher={teacher}
                                favorited={favorites.includes(teacher.id)}
                            />
                        );
                    })
                ) : (
                    <View style={styles.warning}>
                        <Feather name="search" size={40} color="#8257e5" />
                        <Text style={styles.warningText}>
                            Busque por um Proffy
                            {"\n"}
                        </Text>
                    </View>
                )}
            </ScrollView>
        </View>
    );
};

export default TeacherList;
