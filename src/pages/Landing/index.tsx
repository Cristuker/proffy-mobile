import React, { useEffect, useState } from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { RectButton } from "react-native-gesture-handler";

import api from "../../services/api";

import LandingImg from "../../assets/images/landing.png";
import studyIcon from "../../assets/images/icons/study.png";
import giveClassesIcon from "../../assets/images/icons/give-classes.png";
import heartIcon from "../../assets/images/icons/heart.png";

import styles from "./styles";

const Landing: React.FC = () => {
    const { navigate } = useNavigation();
    const [totalConnections, setTotalConnections] = useState(0);

    function handleNavigateToGiveClassesPage() {
        navigate("GiveClasses");
    }

    function handleNavigateToStudyPage() {
        navigate("Study");
    }

    useEffect(() => {
        api.get("connections").then((response) => {
            const { total } = response.data;
            setTotalConnections(total);
        });
    }, []);

    return (
        <View style={styles.container}>
            <Image source={LandingImg} style={styles.banner}></Image>
            <Text style={styles.title}>
                {" "}
                Seja bem-vindo, {"\n"}{" "}
                <Text style={styles.titleBold}>O que deseja fazer?</Text>
            </Text>
            <View style={styles.buttonContainer}>
                <RectButton
                    onPress={handleNavigateToStudyPage}
                    style={[styles.button, styles.buttonPrimary]}
                >
                    <Text style={styles.buttonText}>Estudar</Text>
                    <Image source={studyIcon} />
                </RectButton>
                <RectButton
                    onPress={handleNavigateToGiveClassesPage}
                    style={[styles.button, styles.buttonSecondary]}
                >
                    <Text style={styles.buttonText}>Dar aulas</Text>
                    <Image source={giveClassesIcon} />
                </RectButton>
            </View>
            <Text style={styles.totalConnections}>
                Total de {totalConnections} conexões já realizadas{"  "}
                <Image source={heartIcon} />
            </Text>
        </View>
    );
};

export default Landing;
