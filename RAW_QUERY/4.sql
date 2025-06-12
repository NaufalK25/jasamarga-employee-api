WITH latest_education AS (
    SELECT DISTINCT ON (employee_id)
        employee_id,
        name AS school_name,
        level
    FROM education
    ORDER BY employee_id, level DESC
), employee_family_relation AS (
    SELECT
        ef.employee_id,
        CASE
            WHEN ef.relation_status = 'Suami' THEN COUNT(*) || ' Suami'
            WHEN ef.relation_status = 'Istri' THEN COUNT(*) || ' Istri'
            WHEN ef.relation_status = 'Anak' THEN COUNT(*) || ' Anak'
            WHEN ef.relation_status = 'Anak Sambung' THEN COUNT(*) || ' Anak Sambung'
            ELSE COUNT(*) || ' ' || ef.relation_status
        END AS relation_status_result,
        CASE
            WHEN ef.relation_status = 'Suami' THEN 1
            WHEN ef.relation_status = 'Istri' THEN 2
            WHEN ef.relation_status = 'Anak' THEN 3
            WHEN ef.relation_status = 'Anak Sambung' THEN 4
            ELSE 5
        END AS sort_order
    FROM employee_family ef
    GROUP BY
        ef.employee_id,
        ef.relation_status
)

SELECT
    ep.employee_id,
    e.nik,
    e.name,
    e.is_active,
    ep.gender,
	le.school_name,
    le.level,
    concat(date_part ('year', age(ep.date_of_birth)), ' Years Old') AS age,
    CASE
        WHEN COUNT(efr.relation_status_result) = 0 THEN '-'
        ELSE string_agg (efr.relation_status_result, ' & ' ORDER BY efr.sort_order)
    END AS family_data
FROM
    employee e
    LEFT JOIN employee_profile ep ON e.id = ep.employee_id
	LEFT JOIN latest_education le ON e.id = le.employee_id
    LEFT JOIN employee_family_relation efr ON e.id = efr.employee_id
GROUP BY
    ep.employee_id,
    e.nik,
    e.name,
    e.is_active,
    ep.gender,
    ep.date_of_birth,
	le.school_name,
    le.level
ORDER BY ep.employee_id ASC