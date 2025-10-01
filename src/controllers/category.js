const { where } = require("sequelize");
const { Categories, Courses, Enrollments } = require("../../models/index.js");
const { validate } = require("uuid");


module.exports = {
    async createCategory(req, res) {
        const { name, description
        } = req.body;

        if (!name || !description) {
            return res.status(400).json({
                message: "Por favor informe o nome e a descrição da categoria"
            })
        }

        const existCategory = await Categories.findOne({
            where: {
                name: name
            }
        })

        if (existCategory) {
            return res.status(400).json({
                message: "Esta categoria já existe, tente mudar o nome"
            });
        }

        try {
            const createCategory = await Categories.create({
                name, description
            });
            return res.status(201).json(createCategory);
        } catch (error) {
            return res.status(500).json({
                message: "Não foi possível criar essa categoria, tente novamente",
                error: error
            });
        }
    },

    async eachCategory(req, res) {
        try {
            const category_id = req.params.category_id;

            if (!category_id || !validate(category_id)) {
                return res.status(400).json({
                    message: "A categoria que se deseja pegar deve ser especificada"
                })
            }

            const category = await Categories.findOne({
                where: {
                    id: category_id
                }
            });

            return res.status(200).json(category);
        } catch (error) {
            return res.status(500).json({
                message: "Erro ao trazer a categoria ",
                error: error.message
            });
        }
    },

    async listCategory(req, res) {
        const limit = req.query.limit || 10;
        const page = req.query.page || 1;
        const offset = limit * (page - 1);

        try {
            const category = await Categories.findAll({
                limit: limit,
                offset: offset,
                order: [["createdAt", "DESC"]]
            });
            return res.status(200).json(category);
        } catch (error) {
            return res.status(500).json({
                message: "Erro ao trazer as categorias",
                error: error
            });
        }
    },

    async updateCategory(req, res) {
        const { name, description } = req.body;
        const category_id = req.params.category_id;

        if (!category_id || !validate(category_id)) {
            return res.status(400).json({
                message: "A categoria que se deseja modificar deve ser especificada"
            });
        }

        const existCategory = await Categories.findOne({
            where: { id: category_id }
        });

        if (!existCategory) {
            return res.status(400).json({
                message: "Esta categoria não existe"
            });
        }

        try {
            // 🚨 Verificar se já existe outra categoria com o mesmo nome
            if (name) {
                const nameAlreadyExists = await Categories.findOne({
                    where: { name }
                });

                if (nameAlreadyExists && nameAlreadyExists.id !== category_id) {
                    return res.status(400).json({
                        message: "Já existe uma categoria com este nome"
                    });
                }
            }

            await Categories.update(
                {
                    name: name || existCategory.name,
                    description: description || existCategory.description
                },
                {
                    where: { id: category_id }
                }
            );

            const existCategoryNew = await Categories.findOne({
                where: { id: category_id }
            });

            return res.status(200).json(existCategoryNew);
        } catch (error) {
            return res.status(500).json({
                message: "Não foi possível actualizar esta categoria, tente novamente",
                error: error.message
            });
        }
    },

    async deleteCategory(req, res) {
        try {
            const category_id = req.params.category_id;

            if (!category_id || !validate(category_id)) {
                return res.status(400).json({
                    message: "A categoria que se deseja deletar deve ser especificada"
                });
            }

            const category = await Categories.findOne({
                where: { id: category_id }
            });

            if (!category) {
                return res.status(400).json({
                    message: "Categoria não encontrada!"
                });
            }

            // 1️⃣ Buscar todos os cursos dessa categoria
            const courses = await Courses.findAll({
                where: { category_id }
            });

            // 2️⃣ Para cada curso, deletar os enrollments
            for (const course of courses) {
                await Enrollments.destroy({
                    where: { course_id: course.id }
                });
            }

            // 3️⃣ Agora deletar os cursos
            await Courses.destroy({
                where: { category_id }
            });

            // 4️⃣ Finalmente deletar a categoria
            await Categories.destroy({
                where: { id: category_id }
            });

            return res.status(200).json({
                message: "Categoria e todos os cursos/inscrições relacionados foram deletados com sucesso"
            });
        } catch (error) {
            return res.status(500).json({
                message: "Erro ao deletar a categoria",
                error: error.message
            });
        }
    }

}