import cv2
import numpy as np
import tensorflow as tf
from tensorflow.keras.preprocessing.image import load_img, img_to_array
from PIL import Image, UnidentifiedImageError
import os
from flask import current_app

MODEL_PATH = 'models/waste_classifier_model.h5'
CLASS_NAMES = ["électroniques", "automobiles", "batterie", "papier", "Ampoules", "métalliques", "organiques", "plastiques", "verre"]

# Charger le modèle TensorFlow
model = tf.keras.models.load_model(MODEL_PATH)

def preprocess_image(file, filename):
    """Traite l'image (chargement, redimensionnement et normalisation)"""
    try:
        # Prétraitement de l'image
        image = cv2.imread(image_path)
        image = cv2.resize(image, (224, 224))  # Redimensionner selon les besoins du modèle
        image = image / 255.0  # Normaliser
        image = np.expand_dims(image, axis=0)  # Ajouter une dimension pour le batch
    except Exception as e:
        print(f"Erreur avec OpenCV : {e}, tentative avec PIL")
        
        # Tentative avec PIL si OpenCV échoue
        try:
            image_path = os.path.join(current_app.config['UPLOAD_FOLDER']) + filename
            image = load_img(image_path, target_size=(224, 224))
            image = img_to_array(image)
            image = image / 255.0
            image = np.expand_dims(image, axis=0)  # Ajouter la dimension du batch
        except (UnidentifiedImageError, ValueError) as pil_error:
            print(f"Erreur avec PIL : {pil_error}")
            raise

    return image

def process_image(file, filename):
    """Effectue la prédiction de la classe de à partir de l'image"""
    try:
        image = preprocess_image(file, filename)
        
        # Prédiction
        predictions = model.predict(image)
        predicted_class = CLASS_NAMES[np.argmax(predictions)]  # Classe prédite
        confidence = float(np.max(predictions) * 100)  # Confiance sous forme de pourcentage
        
        return predicted_class, confidence
    except Exception as e:
        print(f"Erreur lors du traitement de l'image : {e}")
        return None, None