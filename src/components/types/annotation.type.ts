import Feature from "ol/Feature";

export type Annotation = {
  id: string;
  title: string;
  description: string;
  borderColor: string;
  fillColor: string;
  iconName?: string;
  feature: Feature;
  dateCreated: string;
};

export type AnnotationUpdate = Partial<Omit<Annotation, "id" | "feature">>;
