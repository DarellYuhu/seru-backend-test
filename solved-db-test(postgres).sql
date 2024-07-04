-- ----------------------- 1 --------------------------
SELECT 
    students.name AS student_name,
    classes.name AS class_name,
    teachers.name AS teacher_name
FROM 
    students
JOIN 
    classes ON students.class_id = classes.id
JOIN 
    teachers ON classes.teacher_id = teachers.id;

-- ----------------------- 2 --------------------------
SELECT 
    teachers.name AS teacher_name,
    STRING_AGG(classes.name, ', ') AS class_names
FROM 
    classes
JOIN 
    teachers ON classes.teacher_id = teachers.id
GROUP BY 
    teachers.name;

-- ----------------------- 3 --------------------------
CREATE VIEW student_class_teacher_view AS
SELECT 
    students.name AS student_name,
    classes.name AS class_name,
    teachers.name AS teacher_name
FROM 
    students
JOIN 
    classes ON students.class_id = classes.id
JOIN 
    teachers ON classes.teacher_id = teachers.id;

-- ----------------------- 4 --------------------------
CREATE OR REPLACE FUNCTION get_student_class_teacher()
RETURNS TABLE (
    student_name VARCHAR,
    class_name VARCHAR,
    teacher_name VARCHAR
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        students.name AS student_name,
        classes.name AS class_name,
        teachers.name AS teacher_name
    FROM 
        students
    JOIN 
        classes ON students.class_id = classes.id
    JOIN 
        teachers ON classes.teacher_id = teachers.id;
END;
$$ LANGUAGE plpgsql;

-- ----------------------- 5  --------------------------
CREATE OR REPLACE FUNCTION insert_student(
    _name VARCHAR,
    _age INT,
    _class_id INT
) RETURNS VOID AS $$
BEGIN
    IF EXISTS (SELECT 1 FROM students WHERE name = _name AND age = _age AND class_id = _class_id) THEN
        RAISE EXCEPTION 'Duplicate entry detected for student %', _name;
    ELSE
        INSERT INTO students (name, age, class_id) VALUES (_name, _age, _class_id);
    END IF;
END;
$$ LANGUAGE plpgsql;