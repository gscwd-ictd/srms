import Feature from "ol/Feature";

export type Annotation = {
  id: string;
  title: string;
  description: string;
  borderColor: string;
  fillColor: string;
  feature: Feature;
};

export type AnnotationUpdate = Partial<Omit<Annotation, "id" | "feature">>;
