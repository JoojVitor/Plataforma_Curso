"use client";

import { useEffect, useState } from "react";
import { ApiClient } from "@/lib/api-client";
import { useParams, redirect } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import CreateCoursePage from "../../create/page";

export default function EditCoursePage() {
  const { user } = useAuth();
  const { id } = useParams();

  const [course, setCourse] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    if (user.role !== "instrutor" && user.role !== "admin") {
      redirect("/dashboard");
    }

    ApiClient.getCourseById(id as string)
      .then((data) => {
        setCourse(data);
      })
      .catch((err) => {
        if (err.status === 403) redirect("/my-courses");
        if (err.status === 404) redirect("/not-found");
      })
      .finally(() => setLoading(false));
  }, [id, user]);

  if (loading) return <p>Carregando...</p>;

  return <CreateCoursePage existingCourse={course} />;
}
