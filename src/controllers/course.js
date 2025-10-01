const { where, ValidationError } = require("sequelize");
const { Courses, Enrollments, Categories } = require("../../models/index.js");
const { validate } = require("uuid");

module.exports = {
    async createCourse(req, res) {
        const { title, description, price,
            limit, address, modality,
            date_start, workload, image
        } = req.body;

        const category_id = req.params.category_id;
        if (!category_id || !validate(category_id)) {
            return res.status(400).json({
                message: "Precisa especificar em qual categoria este curso vai se encontrar"
            })
        }

        const existCategory = await Categories.findOne({
            where: { id: category_id }
        });

        if (!existCategory) {
            return res.status(400).json({
                message: "Esta categoria não existe"
            })
        }

        const modalityToken = modality != "online" ? "inperson" : "online";
        if (!title || !description) {
            return res.status(400).json({
                message: "O título a descrição são obrigatótio"
            })
        }

        if (modalityToken != "online" && !address) {
            return res.status(400).json({
                message: "Para cursos presenciais, deve se passar o local do curso"
            })
        }

        if (!date_start || !workload) {
            return res.status(400).json({
                message: "Adicione a data de início e a carga horária para continuar"
            });
        }

        if (price == null || price == undefined || limit == null || limit == undefined) {
            return res.status(400).json({
                message: "O limit de inscritos, e o preço do curso são obrigatórios"
            })
        }

        if (typeof price != "number" || typeof limit != "number") {
            return res.status(400).json({
                message: "O limit de inscritos, e o preço do curso devem ser numericos"
            })
        }

        const existCourse = await Courses.findOne({
            where: {
                title: title
            }
        });

        if (existCourse) {
            return res.status(400).json({
                message: "Já existe um curso com este nome, tente um outro"
            });
        }

        try {
            const createCourse = await Courses.create({
                title: title,
                description,
                price,
                limit,
                address,
                modality: modalityToken,
                date_start,
                workload,
                image,
                category_id
            });
            return res.status(201).json(createCourse);
        } catch (error) {
            return res.status(500).json({
                message: "Não foi possível criar novo curso, tente novamente",
                error: error
            });
        }
    },

    async eachCourse(req, res) {
        try {
            const course_id = req.params.course_id;

            if (!course_id || !validate(course_id)) {
                return res.status(400).json({
                    message: "O curso que se deseja pegar deve ser especificado"
                })
            }

            const course = await Courses.findOne({
                where: {
                    id: course_id
                },
                include: [
                    {
                        model: Categories,
                        as: "category", // garante que tens associação no model
                        attributes: ["id", "name"]
                    }
                ]
            });

            if (!course) {
                return res.status(400).json({
                    message: "Este curso não existe"
                })
            }

            const existCategory = await Categories.findOne({
                where: { id: course.category_id }
            })

            if (!existCategory) {
                return res.status(400).json({
                    message: "Esta categoria não existe"
                })
            }
            // Converter para JSON limpo
            const result = course.toJSON();
            result.category_name = result.category.name;
            delete result.category;
            return res.status(200).json(result);
        } catch (error) {
            return res.status(500).json({
                message: "Erro ao trazer o curso",
                error: error.message
            });
        }
    },

    async listCourse(req, res) {
        const limit = parseInt(req.query.limit) || 10;
        const page = parseInt(req.query.page) || 1;
        const offset = limit * (page - 1);
        const category_id = req.query.category_id;

        let newWhere = { active: true };

        if (category_id) {
            newWhere.category_id = category_id;
        }

        try {
            const courses = await Courses.findAll({
                limit,
                offset,
                where: newWhere,
                order: [["createdAt", "DESC"]],
                include: [
                    {
                        model: Categories,
                        as: "category", // garante que tens associação no model
                        attributes: ["id", "name"]
                    }
                ]
            });

            // Converter para JSON limpo
            const result = courses.map(course => {
                const data = course.toJSON();
                data.category_name = data.category?.name || null;
                delete data.category; // opcional: remover o objeto category completo
                return data;
            });

            return res.status(200).json(result);
        } catch (error) {
            return res.status(500).json({
                message: "Erro ao trazer os cursos",
                error: error.message
            });
        }
    },

    async updateCourse(req, res) {
        const { title, description, price,
            limit, address, modality,
            date_start, workload, image, category_id,
            active
        } = req.body;

        const course_id = req.params.course_id;

        if (!course_id || !validate(course_id)) {
            return res.status(400).json({
                message: "O curso que se deseja modificar deve ser especificado"
            })
        }

        const existCourse = await Courses.findOne({
            where: {
                id: course_id
            }
        });

        if (!existCourse) {
            return res.status(400).json({
                message: "Este curso não existe"
            })
        }

        if (!title || !description) {
            return res.status(400).json({
                message: "O título a descrição são obrigatótio"
            })
        }

        if ((price && typeof price != "number") || (typeof limit != "number" && limit)) {
            return res.status(400).json({
                message: "O limit de inscritos, e o preço do curso devem ser numericos"
            })
        }
        // 🚨 Verificar se já existe outra categoria com o mesmo nome
        if (title) {
            const nameAlreadyExists = await Courses.findOne({
                where: { title }
            });

            if (nameAlreadyExists && nameAlreadyExists.id !== course_id) {
                return res.status(400).json({
                    message: "Já existe um curso com este nome"
                });
            }
        }
        try {
            let newImage = image;
            if (newImage == "")
                newImage = "";
            else if (!newImage)
                newImage = existCourse.image;
            await Courses.update(
                {
                    title: title || existCourse.title,
                    description: description || existCourse.description,
                    price: price || existCourse.price,
                    limit: limit || existCourse.limit,
                    address: address || existCourse.address,
                    modality: modality || existCourse.modality,
                    date_start: date_start || existCourse.date_start,
                    workload: workload || existCourse.workload,
                    image: newImage,
                    active: active || existCourse.active,
                    category_id: category_id || existCourse.category_id
                },
                {
                    where: {
                        id: course_id
                    }
                },
            );
            const existCourseNew = await Courses.findOne({
                where: {
                    id: course_id
                }
            });
            return res.status(200).json(existCourseNew);
        } catch (error) {
            return res.status(500).json({
                message: "Não foi possível actualizar este curso, tente novamente",
                error: error
            });
        }
    },

    async searchCourses(req, res) {
        try {
            const { title } = req.body; // termo de busca
            const { course_id } = req.params;

            if (!course_id || !validate(course_id)) {
                return res.status(400).json({
                    message: "Por favor especifique o curso",
                });
            }

            if (!title) {
                return res.status(400).json({
                    message: "Por favor digite o nome do curso",
                });
            }

            let where = { course_id };

            if (title) {
                where[Op.or] = [
                    { title: { [Op.iLike]: `%${title}%` } },
                ];
            }

            const courses = await Courses.findAll({
                where,
                order: [["createdAt", "DESC"]]
            });

            return res.status(200).json(courses);
        } catch (error) {
            return res.status(500).json({
                message: "Erro ao buscar cursos",
                error: error.message
            });
        }
    },

    async deleteCourse(req, res) {
        try {
            const course_id = req.params.course_id;

            if (!course_id || !validate(course_id)) {
                return res.status(400).json({
                    message: "O curso que se deseja deletar deve ser especificado"
                })
            }

            const courses = await Courses.findOne({
                where: {
                    id: course_id
                }
            });

            if (!courses) {
                return res.status(400).json({
                    message: "Curso não encontrado!"
                })
            }

            await Enrollments.destroy({
                where: {
                    course_id: course_id
                }
            })

            await Courses.destroy({
                where: {
                    id: course_id
                }
            })

            return res.status(200).json({
                message: "Curso/inscritos deletado com sucesso"
            });
        } catch (error) {
            return res.status(500).json({
                message: "Erro ao deletar o curso",
                error: error.message
            });
        }

    }
}